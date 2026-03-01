---
slug: "/blog/dns-rdns"
date: "2026-02-26"
title: "Inner Workings of Forward DNS and Reverse DNS"
subtitle: "Inner Workings of Forward DNS and Reverse DNS"
---

## **FCrDNS: Trying to block sitemaps from Bad Actors**

- I came accross these concepts when I started trying to block sitemaps for our website. Bad actors started crawling a lot so I decided to show sitemaps only to desired vendors.
- There are two ways to distinguish a unwanted bot versus wanted bot owned by vendor we want to show our contents to:
  1. forwared confirmed reverse dns (the topic of this article)
  2. json ip list that all vendors provide.
     - every vendor provides these ip lists on their crawl bot guide page.
- Second choise is cheap but the first one is more up to date and accurate.
- Especially bing bot seems to eat up a whole lot of ip range which seemed like they were sharing some cloud ip resources with their bots which was allowing too many of ips. In this case, FCrDNS can be more accurate.
- I got curious about the mechanisms of these DNS checks so did a quick research.

## **1. Forward DNS**

- All requests done on browser are done via forward dns.
- We enter a domain name and that is translated into a pure ip address to make a tcp connection.
- Translation happens like this:
  - Step 0 is browser checking its cache and then checking OS for cached hosts.

| Step       | Target                       | Operated By                                                     | Official Reason (Public Mission)                                | Actual Benefit (The "Why")                                                                                                      |
| ---------- | ---------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Step 1** | **Recursive Resolver**       | **ISPs** (Comcast, Verizon) / **Big Tech** (Google, Cloudflare) | To resolve DNS requests on behalf of the user.                  | **ISPs:** Retention (quality of service). **Big Tech:** **Massive Data.** They see exactly which websites everyone is visiting. |
| **Step 2** | **Root Nameservers**         | **ICANN**, NASA, US Army, Universities, Non-profits             | To maintain the top-level hierarchy of the internet.            | **No direct profit.** They do it for global stability and "prestige." ICANN uses the $0.18 fee to cover operational costs.      |
| **Step 3** | **TLD Nameservers**          | **Registries** (e.g., Verisign for `.com`, KISA for `.kr`)      | To manage the database of specific domain extensions.           | **The "Cash Cow."** They make billions by charging a wholesale fee for every single domain registered or renewed.               |
| **Step 4** | **Authoritative Nameserver** | **Hosting Providers** (AWS, GoDaddy, Bluehost)                  | To store and serve the actual IP address of a specific website. | **Service Fees.** They charge the website owner for the convenience of managing their DNS records.                              |

Most step returns the result directly if they have the data. If you look at above chart, you won't get exactly whats happening. The missing key is "why and when and how often would each step have a cache miss?" This is answered below:

**Step 1: Recursive Resolver (ISP/Google DNS)**

This is where most "Cache Misses" happen for the following reasons:

- **TTL (Time To Live) Expiration:** Every DNS record has a set lifespan. Once this time expires, the resolver **forcibly deletes** the record to ensure it doesn't serve outdated information.
- **First-time Request:** If no one using that specific ISP or resolver has visited the site recently, the data simply doesn't exist yet.
- **Cache Eviction:** Resolvers have limited storage. They may purge rarely visited records to make room for more popular ones.

#### **Step 2: Root Nameservers**

The resolver visits the Root when it doesn't even know where the TLD server (e.g., for `.com`) is located.

- **TLD Information Expiry:** The location of the `.com` or `.kr` servers also has a TTL. If this "pointer" expires, the resolver must ask the Root again to ensure the TLD infrastructure hasn't changed.

#### **Step 3: TLD Nameservers (.com, .org, etc.)**

The resolver goes here to find out which specific **Authoritative Server** holds the records for a domain like `example.com`.

- **Unknown Authority:** If the resolver's cache of "where the domain's records are kept" has expired, it must return to the TLD server.
- **Name Server (NS) Changes:** If a website owner switches their DNS provider (e.g., moving from GoDaddy to AWS), the TLD server is the first to be updated with the new location.

#### **Step 4: Authoritative Nameservers**

This is the **Source of Truth** (the original address book), not a cache.

- **Actual IP Retrieval:** The resolver comes here to fetch the final, definitive IP address (A-record).
- **Reflecting Updates:** When a website owner changes their server's IP, this server is updated immediately. The resolver must reach this final step to "learn" the new IP and refresh its own cache.

There are quite a lot of layers and it is exremely intruiging to see there are many organizations providing servies due to different benefits.

## **2. Reverse DNS**

Reverse DNS (rDNS) follows a similar hierarchical path to Forward DNS but travels through a specialized branch of the internet’s "address book" called the **.arpa** zone. To make this work, the IP address is reversed (e.g., `1.2.3.4` becomes `4.3.2.1.in-addr.arpa`) so it can be read like a domain name from right to left.

### **Step 1: Recursive Resolver (Your ISP or Google DNS)**

- **Action:** Receives the request to find the name for an IP (e.g., `8.8.4.4`). It flips the IP and attaches a suffix, creating a query for `4.4.8.8.in-addr.arpa`.
- **Why Cache Misses?** rDNS lookups are much less frequent than forward lookups, so the results are rarely sitting in the cache unless a similar security check was performed very recently.

### **Step 2: Root Nameserver**

- **Action:** The Resolver asks the Root, "Who manages the **.arpa** extension?"
- **Result:** The Root points the Resolver to the servers managed by **IANA/ICANN** that handle the infrastructure-specific `.arpa` zone.

### **Step 3: TLD / Intermediate Server (.arpa & in-addr.arpa)**

- **Action:** The Resolver asks the `.arpa` server, "Who manages **in-addr.arpa** (the IPv4 directory)?"
- **Result:** It gets directed to the servers that manage the global IP address space.

### **Step 4: RIR (Regional Internet Registry) Server**

- **Action:** This is the big pivot. The Resolver asks the RIR (like **APNIC** for Asia or **ARIN** for North America), "Who owns the network block starting with `8.8`?"
- **Result:** The RIR identifies the owner of that specific IP range (e.g., Google or a specific ISP like KT/Verizon) and points to *their* nameservers.

### **Step 5: Authoritative Server (The IP Owner / ISP)**

- **Action:** The Resolver finally asks the ISP's server, "What is the **PTR Record** (Pointer) for `4.4.8.8.in-addr.arpa`?"
- **Result:** The ISP returns the hostname (e.g., `dns.google`). This is the **Source of Truth** for that IP's identity.

---

### **The Incentives: Why do they do it?**

|              |                      |                                                                                                                                                                                 |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Step**     | **Player**           | **The "Benefit" (Why they participate)**                                                                                                                                        |
| **Step 1**   | **Resolver (ISP)**   | **Security:** They use rDNS to verify that an incoming connection is legitimate and not a spoofed IP.                                                                           |
| **Step 2/3** | **ICANN / IANA**     | **Standardization:** As the global governors, they maintain the `.arpa` zone to ensure the internet's core infrastructure remains searchable.                                   |
| **Step 4**   | **RIR (APNIC/ARIN)** | **Accountability:** They track who "owns" which IP block to prevent address squatting and to resolve routing disputes. They are non-profit and gets paid by ISPs and Big Techs. |
| **Step 5**   | **ISP / IP Owner**   | **Email Deliverability:** If an ISP doesn't set up rDNS (PTR records) for its mail servers, most other servers (like Gmail or Outlook) will block their emails as **Spam**.     |

---

### **Summary Table: Forward vs. Reverse**

|                    |                            |                         |
| ------------------ | -------------------------- | ----------------------- |
| **Feature**        | **Forward DNS**            | **Reverse DNS**         |
| **Starts with...** | Domain Name (`google.com`) | IP Address (`8.8.8.8`)  |
| **Ends with...**   | IP Address (`8.8.8.8`)     | Hostname (`dns.google`) |
| **Primary Record** | **A Record**               | **PTR Record**          |
| **Key Hierarchy**  | `.com` / `.net` / `.kr`    | `.in-addr.arpa`         |

Would you like me to show you how to run a reverse lookup on your own IP address using the `nslookup` or `dig -x` command?

## 3. **FCrDNS**

- Why forward confirm the rdns?
  - rdns has one blindspot: someone can register themself has a owner of a dns on the ISP.
  - What? Then that is a problem with ISP. Why do they allow fake data?
  - Below section explains the important bits.

## **Why Do ISPs Allow PTR Record Spoofing?**

### **1. Delegation of Authority (The "Landlord" Model)**

When a company or a hosting provider rents a large block of IP addresses, the ISP usually **delegates** the management of those IPs to them.

- **The Logic:** The ISP doesn't want to spend manual labor updating thousands of records every time a customer changes their mind.
- **The Result:** They hand over the "keys" to the DNS zone. Once you have the keys, you can write whatever you want in the **PTR record**. The ISP acts as the landlord who doesn't care what color you paint the walls inside your apartment.

### **2. The Scale and Cost of Real-Time Verification**

To prevent "spoofing," an ISP would have to verify every single PTR record entry against the global Forward DNS database.

- **The Problem:** Forward DNS changes constantly. A record that is valid at 9:00 AM might be invalid at 9:05 AM.
- **The Cost:** Building a system to cross-reference billions of global records in real-time is an enormous technical and financial burden. ISPs prefer to remain "dumb pipes" that move data rather than "truth police."

### **3. Legitimate "Business Spoofing" (White-Labeling)**

Not all "fake" names are malicious. Many businesses actually _need_ to look like someone else for legitimate reasons:

- **Marketing Agencies:** A firm might send emails on behalf of a client (e.g., Apple or Nike). They need their server IP to resolve to a name associated with the client's brand.
- **CDNs and Cloud Providers:** Services like AWS or Cloudflare host thousands of different domains on the same IP. Forcing a single "truthful" name would break their business model.

### **4. The "End-to-End" Principle of the Internet**

The internet was designed with the philosophy that the **network should be simple**, and the **endpoints should be smart**.

- The ISP's job is to get a packet from point A to point B.
- The job of verifying the identity of the sender belongs to the **Receiver** (like Gmail or Outlook). This is why tools like **FCrDNS** (Forward-Confirmed Reverse DNS) exist—to let the receiver catch the lies that the ISP didn't filter.

---

## **Summary: ISP vs. Receiver Responsibilities**

| Aspect         | The ISP (The Road)                        | The Receiver (The Checkpoint)                          |
| -------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Philosophy** | "I just provide the path."                | "I verify who is entering my gate."                    |
| **Role**       | Neutrality & Efficiency                   | Security & Validation                                  |
| **Action**     | Delegates control to the user.            | Performs **FCrDNS** to catch spoofing.                 |
| **Analogy**    | A road manager who doesn't check your ID. | A bouncer at a club who checks your ID against a list. |

---

### **The Bottom Line**

The ISP isn't "allowing" spoofing as a feature; they are providing **autonomy** to the IP owner. They assume that if you lie about your identity, the rest of the internet will simply block you—which is exactly what happens in the world of email and high-security servers.
