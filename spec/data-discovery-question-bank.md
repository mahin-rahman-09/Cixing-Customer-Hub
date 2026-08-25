# Cixing Customer Hub — Data Discovery Question Bank

**Purpose:** Before locking any database field into Supabase, find out what data the team actually uses, actually maintains, and actually needs — versus what a generic CRM template assumes they need. Every "yes" answer becomes a candidate field. Every "no" or blank stare is a field we should cut or defer.

**How to use this:**
- Don't run this as a formal survey. Have it open during a normal conversation and pick relevant questions.
- Ask **salespeople** the Sales-facing sections; ask **management** the Management-facing sections. Some sections apply to both — ask both and compare answers (mismatches are often the most useful finding).
- For every field-related question, also ask: *"How often is this actually filled in / kept up to date?"* — a field that's always blank in practice isn't a real field, no matter how useful it sounds in theory.
- Mark each answer: ✅ Keep as-is · ✏️ Keep, but change how · ❌ Drop · ➕ New field we hadn't thought of

---

## Sector 1 — Factory Database & Company Profile
*(Who are we selling to, and what do we actually know about them?)*

### Identity & basic record-keeping
1. When a new factory is added to any spreadsheet, what's the very first piece of information written down?
2. Do factories get referred to by their trading name, their legal/registered name, or both? Are these ever different?
3. How do you currently tell two factories with similar names apart (e.g. two "Bengal" factories)?
4. Do factories belong to larger business groups/conglomerates in practice? How often does that come up?
5. Is a factory's physical address actually used for anything (routing visits, deliveries), or is "which industrial area" enough?
6. Do you track a factory's website or social media presence? Has it ever mattered?
7. Is there a company registration number, BGMEA/BKMEA membership number, or similar ID that's relevant?
8. Do you track which buyer/brand a factory produces for (e.g. H&M, Zara supplier)? Does that influence anything?

### Classification & sizing
9. What "types" of factory do you naturally sort them into, in your own words — not a formal list, just how you'd describe it to a colleague?
10. Does factory size (employees, floor space, production capacity) actually change how you approach a sale?
11. How is "production capacity" normally expressed by the factory itself — pieces/month, machines running, something else?
12. Do you track number of knitting machine operators/technicians on staff? Does that matter for a sale?
13. Is there a difference in your approach between a factory that's export-focused vs. domestic-market-focused?

### Competitive & machine landscape
14. What machine brands do competitors' factories currently run? Is this something you know off-hand or have to ask each time?
15. How many competitor machines does a factory typically have, and does that number matter, or just "which brands"?
16. Do you track machine age/condition at competitor factories (i.e., are they due for replacement)?
17. Is there a "which brands does this factory refuse to consider" data point that matters?

### Opportunity assessment
18. When you rate a factory as high-potential vs. low-potential in your head, what are you actually weighing?
19. Does financial health/creditworthiness of a factory ever factor into whether you pursue them?
20. Is there a concept of "not worth pursuing right now, revisit in 6 months" — and if so, what data would you want to see when you revisit?
21. Do you track how a factory was first identified (referral, trade fair, cold visit, inbound inquiry)? Does source affect how you treat the lead?

### Notes & freeform info
22. What kind of thing currently only lives in your personal notebook or memory about a factory — the stuff too "soft" for a spreadsheet cell?
23. Is there sensitive information (e.g. "owner is difficult," "factory has cash flow problems") that exists informally but should never be a shared field everyone sees?
24. Do you track anything about factory politics — e.g. "GM wants this machine, but owner controls the budget and hasn't been convinced"?
25. Is there a "last contacted by anyone at Cixing" concept, separate from "last visited"?

### Data quality reality check
26. Of everything above, what's the one field you'd genuinely fill in every single time without being nagged?
27. What's a field that sounds useful but you know, honestly, nobody would keep updated?
28. Are there factories in your current Excel that are duplicates, outdated, or defunct? Roughly how many?
29. How many total factories are actively tracked right now — even loosely?
30. Are there factories that should exist in the system but currently aren't tracked anywhere formally (e.g. only known by one salesperson)?

### Missing-from-PRD probes
31. Is there a "preferred language for communication" data point (Bangla vs. English) that matters for how a salesperson approaches a factory?
32. Do factories have seasonal patterns (peak order season, slow season) that affect when to approach them?
33. Is there a "distance/travel time from our office" factor that affects visit planning?
34. Do you track which bank a factory uses, for financing-related conversations about machine purchases?
35. Is there a "factory's own expansion plans" data point (e.g. "building a new floor next year")?
36. Do you note whether a factory has worked with Cixing/China HQ directly before, bypassing Bangladesh?
37. Is there a compliance/certification angle (e.g. factories needing certain certifications that affect what machines they can install)?
38. Do you track factory ownership structure (family-owned, corporate, foreign-invested)?
39. Is there a "who referred us to this factory" field, for relationship-mapping purposes?
40. Do you track a factory's current supplier/vendor relationships beyond machine brands (e.g. yarn suppliers) if relevant to a sale?

### Group-level questions (if factory belongs to a business group)
41. When a group owns multiple factories, is the sales relationship managed at the group level or per-factory?
42. Does a win at one factory in a group typically open doors at sister factories? Is this tracked anywhere today?
43. Is there a single group-level decision maker who overrides individual factory GMs?

### Prioritization for this specific project
44. If you could only track 10 fields about a factory and nothing else, which 10?
45. What field, if it existed today, would have saved you the most time or embarrassment in the last 6 months?
46. Has poor factory record-keeping ever caused a real problem — a missed opportunity, an awkward repeat conversation, a lost deal? Walk me through one example.
47. When a new salesperson joins, what do they currently have to learn "the hard way" about a factory that should've been written down?
48. If a factory record could only ever be half-filled-in, which half (which fields) would you want prioritized first?
49. Is there a difference in how much detail matters for an active-opportunity factory vs. a "just watching" factory?
50. Who should be allowed to edit a factory record — anyone, or should some fields be locked to managers only?

---

## Sector 2 — Contact Management
*(Who, specifically, are we talking to inside each factory?)*

### Who counts as a contact
1. Besides the obvious "owner" or "GM," who else at a factory do you regularly talk to?
2. Do you track people below decision-maker level (e.g. floor supervisors, maintenance staff) if they influence the sale?
3. Is there a factory-side "champion" role — someone internally pushing for Cixing even if they're not the final decision maker?
4. Do you track people who've left a factory but might resurface elsewhere later?

### Decision-making reality
5. Is there ever more than one decision maker per factory? How do you currently track "who actually signs off"?
6. Does the real decision maker match the official title (GM, Owner, Director), or is it sometimes someone with a lower-sounding title?
7. Is there a data point for "this person can say yes but not no" vs. "this person can say no but not yes"?
8. Do you track who influences the decision maker even if they never talk to you directly?

### Contact details that actually get used
9. Which contact method do you actually use most — phone call, WhatsApp, email, in-person? Does it vary by contact?
10. Is a work email address ever actually used, or does everything go through personal WhatsApp/phone?
11. Do you track a contact's preferred contact time (e.g. "don't call before 11am")?
12. Is job title/designation something factories give consistently, or is it often vague/informal?

### Relationship depth
13. Is there a "how well do we know this person" rating that matters (e.g. first meeting vs. years-long relationship)?
14. Do you track personal details that help relationship-building (e.g. they like cricket, they have a new baby) — and if so, where does that currently live?
15. Is there a "this contact prefers dealing with [specific salesperson]" pattern that should be tracked?
16. Do you track how a contact was introduced (met at trade fair, introduced by another factory, cold approach)?

### Contact lifecycle
17. How often do contacts change roles or leave factories? Is this something you find out proactively or by accident?
18. When a contact leaves, does the relationship usually transfer to their replacement, or does it restart from zero?
19. Is there value in keeping a record of former contacts even after they've left (e.g. if they moved to a different factory)?
20. Do you ever lose track of a good contact simply because nobody wrote down their number anywhere shared?

### Multiple contacts per factory
21. On average, how many people would you realistically want tracked per factory — 2? 5? More?
22. Is there a primary/main contact concept, separate from "decision maker"?
23. Do different contacts need different treatment (e.g. technical contact gets technical info, owner gets pricing)?

### Missing-from-PRD probes
24. Do you track a contact's technical background (e.g. "used to be a machine operator, understands specs")?
25. Is there a language preference per contact, separate from the factory-level one?
26. Do you note a contact's attitude toward Cixing specifically (champion, neutral, skeptical, hostile)?
27. Is there a "how to reach them when they're not responding" fallback contact concept?
28. Do you track a contact's role in previous purchase decisions (e.g. "was involved in buying the last 3 Stoll machines")?
29. Is there a birthday/anniversary tracking need for relationship maintenance (common in relationship-heavy B2B sales)?
30. Do you track which contacts attended specific events (trade fairs, demos) for follow-up purposes?

### Data quality reality check
31. What contact info do you currently always have accurate, and what's almost always stale?
32. How often do you discover a phone number is wrong only when you try to call it?
33. Is there a "verified recently" concept that would be useful, or is that overkill?
34. Roughly how many active contacts do you personally keep track of right now, across all factories?

### Access & sensitivity
35. Should every salesperson see every contact at every factory, or are some relationships considered "owned" by one person?
36. Is there contact information that shouldn't be shared company-wide (e.g. a personal favor, an off-the-record source)?
37. If a salesperson leaves the company, what currently happens to their personal contact list? Is that a real risk today?

### Workflow probes
38. When you're about to visit a factory, how do you currently decide who to ask to meet with?
39. Do you ever show up and realize you're meeting the wrong person for what you wanted to discuss? How often?
40. Is there a "hasn't been visited/contacted in a while" flag that would help you decide who to reconnect with?

### Prioritization
41. If you could only track 5 things about a contact, which 5?
42. What's the one contact-related mistake that's happened before that this system should prevent?
43. Would salespeople actually use click-to-call/click-to-WhatsApp buttons, or do they just use their phone's own contacts app regardless?
44. Is there resistance to putting personal WhatsApp numbers into a shared company system? Any privacy concern to address?
45. How would you want to be notified if a decision maker at a hot opportunity switches jobs?
46. Do you ever need to search contacts across factories (e.g. "everyone I've talked to who used to work at X")?
47. Is there a concept of contact "ownership" (whoever built the relationship gets first right of contact)?
48. Would a photo of the contact (business card scan or similar) actually get used, or is that unnecessary polish?
49. Is there a distinction between a factory's "sales contact" and "technical/after-sales contact" that matters structurally?
50. What would make you actually open this module regularly instead of just texting the person directly from your phone?

---

## Sector 3 — Visit Management & Sales Process
*(What actually happens on the ground, and what's worth writing down afterward?)*

### The visit itself
1. Walk me through your last factory visit, start to finish — what happened, in order?
2. How long after a visit do you currently write anything down, if at all?
3. Do you take notes during the visit, or reconstruct them afterward from memory?
4. Is there ever more than one Cixing person at a visit? How should that be recorded?

### Visit types — validating the 20-item list
5. Looking at the 20 visit-type categories in the current plan (New Prospect Introduction, Relationship Building, Requirement Gathering, Factory Assessment, Technical Discussion, Machine Presentation, Sample Discussion, Demonstration, Quotation Submission, Quotation Follow-Up, Price Negotiation, Decision-Maker Meeting, Purchase Intent Confirmation, Order Finalization, Installation Coordination, Training Session, Technical Support, Maintenance Visit, Expansion Discussion, General Follow-Up) — which of these have you genuinely never used or can't imagine using?
6. Which of these feel like they're actually the same thing in practice, just named differently?
7. Is there a visit type missing that's specific to the knitting machine industry (e.g. yarn compatibility testing, sample garment evaluation)?
8. Do visits ever have more than one "type" at once (e.g. a visit that's both technical discussion and price negotiation)?

### What's actually discussed
9. What do you find yourself writing similar notes about, over and over, across different visits — is there a pattern that could become its own field instead of freeform text?
10. Do you track specific machine models discussed during a visit, separately from the general summary?
11. Is competitor information (what a rival salesperson recently offered) something you'd log after a visit?
12. Do you track objections raised (price, financing, brand loyalty, timing) as a specific thing, or just prose?

### Outcomes & next steps
13. After a visit, how do you currently decide what the "next step" is? Is it always obvious, or sometimes unclear?
14. Do outcomes fall into clear buckets (positive/neutral/negative), or is it always more nuanced than that?
15. Is there a "temperature check" — how close to a decision does this visit feel — that would be useful to log?
16. How often does a visit result in literally no next action (a true dead end)?

### Frequency & cadence
17. How many visits does a single factory typically get before a machine is sold — rough range?
18. Is there a "how long has it been since we visited this factory" threshold that should trigger a warning (e.g. 60 days)?
19. Do relationship-only visits (no immediate sales purpose) happen? How often, and are they tracked the same way?

### Group/team visits
20. When a visit involves someone besides the primary salesperson (e.g. a technical specialist from head office), how should that be captured?
21. Is there value in a manager reviewing visit notes regularly, or is that seen as micromanagement?

### Missing-from-PRD probes
22. Do you track weather, transportation issues, or other visit-logistics friction that affects planning future visits?
23. Is there a "visit was cancelled/rescheduled" pattern worth tracking (shows factory engagement level)?
24. Do you ever combine multiple factory visits in a single day/route? Would trip-planning matter?
25. Is there a technical spec discussion that should be structured (which fabric types, gauge, machine width) rather than freeform notes?
26. Do you track whether a demo or sample was requested and whether it was fulfilled?
27. Is there a "who initiated this visit" field — us reaching out, or them requesting it — that matters?
28. Do visits ever happen at Cixing's office/showroom rather than the factory? Should that be distinguished?

### Mobile/field reality
29. When you're standing in a factory, would you actually pull out your phone to log something, or does that feel awkward/unprofessional in front of the client?
30. Is logging done immediately after leaving (in the car), same evening, or sometimes days later?
31. What's the biggest reason a visit currently doesn't get logged anywhere at all?
32. Would voice notes (talk instead of type) actually get used if available?

### Data quality reality check
33. Of everything discussed in a visit, what's the one piece of information that, if lost, would actually hurt the business?
34. What's currently written down that, honestly, nobody ever reads again?
35. How detailed do visit notes need to be for someone else (a colleague, a new hire) to pick up the relationship cold?

### Prioritization
36. If a visit log took 30 seconds instead of 3 minutes, what would you be willing to cut to get there?
37. What's the minimum information a visit record needs to still be useful 6 months from now?
38. Is there a difference in note-taking depth for a first visit vs. the 10th visit to the same factory?
39. Should visit notes ever be private to the salesperson, or always shared company-wide?
40. Would a "was this visit worth it" simple thumbs up/down actually help management, or is that too reductive?

### Process/workflow probes
41. Does a visit ever need approval or planning beforehand (e.g. manager sign-off before visiting a big prospect)?
42. Is there a expense/cost angle to visits (travel cost, entertainment) that should be tracked here or elsewhere?
43. Do you ever visit a factory speculatively (no appointment, just dropping by)? How common is that?
44. Is there a "referred this factory to a colleague" handoff process that should be tracked?
45. How do visits to existing customers (post-sale) differ in purpose from visits to prospects?

### Reporting needs
46. What visit-related question does management currently ask that's hard to answer quickly?
47. Would a "visits per week per person" metric actually change behavior, or would it just feel like surveillance?
48. Is there a seasonal pattern to visit volume (trade fair season, garment industry's own busy periods)?
49. Would you want to see your own visit history as a personal record, separate from company reporting?
50. What would "a good week" of visits look like, in terms you'd want reflected back to you on a dashboard?

---

## Sector 4 — Follow-Up & Task Management
*(What "pending" actually looks like day to day)*

1. Right now, without this system, how do you remember what you're supposed to do today?
2. Is there a physical notebook, phone reminder app, or WhatsApp "message yourself" habit currently in use?
3. How often does something get forgotten because it wasn't written down anywhere reliable?
4. When a follow-up is created from a visit, is it always clear what the actual task is, or is it sometimes vague ("follow up" with no specifics)?
5. Do follow-ups ever get assigned to someone other than the person who had the original visit?
6. Is there a concept of a follow-up "owned" by the company rather than a specific person (e.g. if someone's on leave)?
7. How is priority currently decided — gut feeling, deal size, how demanding the contact is, something else?
8. Do overdue follow-ups currently get any kind of escalation, or do they just quietly slip?
9. Is there a difference between a "soft" follow-up (nice to do) and a "hard" deadline (contact is expecting a call)?
10. How far in advance do follow-up dates typically get set — next day, next week, next month?
11. Does a follow-up ever need a specific time, not just a date (e.g. "call at 3pm")?
12. Is there a recurring follow-up need (e.g. quarterly check-in) that's different from a one-off task?
13. When a follow-up is completed, does anything else need to happen automatically (e.g. logging a new visit)?
14. Is there a "snooze" behavior currently used informally — pushing something back without really dealing with it?
15. How often does a follow-up get pushed back more than once? Is that a red flag worth surfacing?
16. Do managers currently ask salespeople "what's pending" directly, or is there another way they find out?
17. Would a daily "here's what's due today" view actually get checked every morning, realistically?
18. Is there resistance to a system tracking "overdue" tasks — does it feel like surveillance to the team?
19. What's the current consequence, if any, of letting a follow-up go overdue?
20. Do follow-ups ever get created for things unrelated to a specific factory (e.g. internal admin tasks)? Should those live in this system at all?
21. Is there a follow-up type distinction that matters (call vs. visit vs. send document vs. internal task)?
22. How do you currently prioritize your day when you have more follow-ups than time?
23. Would color-coding by priority actually change what gets done first, or is due-date the only thing that matters in practice?
24. Is there a "waiting on the customer" status distinct from "waiting on us" that would be useful?
25. Do follow-ups ever get created by someone other than the person responsible for completing them (e.g. a manager assigning a task)?
26. What happens today when a salesperson is out sick or on leave — do their follow-ups get covered by someone else?
27. Is there value in a "follow-up history" per factory — seeing a pattern of promises made and kept/broken over time?
28. Would a follow-up ever need supporting documents attached (e.g. "send this quotation")?
29. Is there a follow-up volume that feels "normal" per person per week? What does overloaded look like?
30. How do reminders currently reach people — none at all, phone's own reminder app, someone else nagging them?
31. Would an email reminder actually get read, or does everything need to be WhatsApp/SMS to be effective?
32. Is there a "this follow-up is now irrelevant" outcome (e.g. factory decided not to buy) — how should that be closed out, distinct from "completed"?
33. Do follow-ups ever get duplicated (same task logged twice by accident or by two people)? How would you want that handled?
34. Is there a "follow-up completed but nothing came of it" pattern worth distinguishing from "completed successfully"?
35. Would management want to see follow-up completion rate per person as a performance indicator, or would that create the wrong incentives?
36. How often is "responsible employee" actually ambiguous — more than one person could reasonably own a task?
37. Is there a follow-up that spans a long time (e.g. "check in every month until decision") that doesn't fit a single due date?
38. Would a follow-up ever need to be linked to a specific quotation rather than just a factory?
39. What's the ideal number of taps/clicks to mark something done, realistically, for this to become a daily habit?
40. Is there a "follow-up was ignored/never actioned" pattern currently, and if so, why does that happen?
41. Do overdue items eventually just get abandoned, or does someone always eventually chase them down?
42. Would a weekly summary (not just daily) be useful for planning ahead?
43. Is there a "this needs manager involvement" escalation path that should be built in?
44. How would a manager want to reassign a follow-up if someone leaves or is overloaded — easy drag-and-drop, or is that overkill for the team size?
45. Is there a distinction between urgent-but-small tasks and important-but-not-urgent ones that priority alone doesn't capture?
46. Would linking a follow-up to a calendar app (Google Calendar, phone calendar) actually get used?
47. What's the worst consequence that's happened from a missed follow-up historically? Walk me through it.
48. Is there a "customer is following up with us" reverse case — should that be tracked the same way?
49. Would completed follow-ups ever need to be un-completed (marked done by mistake)?
50. If you had to describe the entire point of this follow-up feature in one sentence, from your own experience, what would it be?

---

## Sector 5 — Quotation & Pricing (V2)
*(How a price actually gets from "interested" to "signed")*

1. Who currently creates quotations — every salesperson, or a specific person/department?
2. What software/format is a quotation currently made in (Excel, Word, something else)?
3. How long does it typically take from "customer wants a quote" to "quote is actually sent"?
4. Does a quotation ever go through informal versions (WhatsApp'd numbers) before an official document exists?
5. What information does a real quotation actually contain, beyond machine model/quantity/price?
6. Are payment terms, delivery timelines, or warranty terms part of the quotation, or handled separately?
7. Is pricing standard/fixed, or does it vary significantly deal to deal? What drives the variation?
8. Do quotations reference USD (China HQ pricing) or BDT (local), or both?
9. How often does a quotation get revised after the first version? What typically triggers a revision?
10. Is there an internal approval step before a quotation can be sent (e.g. manager sign-off on discounts)?
11. Who has visibility into quotation values today — everyone, or is pricing considered sensitive?
12. How is quotation status currently tracked, if at all — or does it just live in someone's memory/WhatsApp thread?
13. What causes a quotation to stall (go quiet) most often — price, financing, internal factory politics, competitor offer?
14. Is there a typical timeframe after which a "sent" quotation should be considered stale and followed up on?
15. Do quotations ever expire formally, or is that informal/unenforced in practice?
16. How does a quotation get "won" in practice — verbal agreement, signed PO, deposit payment? Which moment actually counts?
17. Is there a formal "lost" reason tracked when a quotation doesn't convert (price, competitor, budget, timing)?
18. Do multiple quotations ever exist simultaneously for the same factory (different machine configurations being compared)?
19. Is there a discount-approval hierarchy (salesperson can offer X%, manager can offer more)?
20. How are financing/installment arrangements handled — part of the quotation, or a separate conversation entirely?
21. Do quotations need to reference specific technical specs (gauge, needle count, machine width) that vary by factory need?
22. Is there a quotation template reused across similar deals, or is each one built from scratch?
23. What's the actual document that ends up in the customer's hands — PDF, printed, WhatsApp photo of a document?
24. Does the system need to generate the actual quotation document, or just track the status of one made elsewhere?
25. How many quotations would a typical salesperson have open/active at once?
26. Is there a "quotation requested but not yet created" gap that causes delays currently?
27. Do you track which competitor a quotation is being compared against?
28. Is there a "final negotiated price" that differs from the "list/quoted price," and should both be tracked?
29. How often does a customer ask for a quotation revision after initial rejection — is that common?
30. Is there a bundled-deal scenario (machines + training + spare parts) that a simple line-item structure might not capture well?

---

## Sector 6 — Machine Ownership & Installation (V3)
*(What we've actually sold and delivered)*

1. How are machine serial numbers currently tracked, if at all?
2. Is there a central record anywhere today of which factory owns which machines?
3. How would you currently answer "how many CX-252 units have we sold total"? Could you, right now?
4. Do serial numbers get assigned before or after delivery? When are they actually known?
5. Is there a difference between "sold" and "delivered" that matters operationally (e.g. payment terms tied to delivery)?
6. How long does it typically take from order confirmation to delivery? To installation?
7. Who coordinates delivery logistics — Cixing, the factory, a third party?
8. Is installation always done by a Cixing engineer, or sometimes by factory technicians with remote guidance?
9. How is warranty currently tracked, if at all? Does anyone proactively know when a warranty is expiring?
10. Do machines ever get resold or transferred between factories (secondhand within Bangladesh)? Should that be tracked?
11. Is there a "machine currently idle/not in use" status that matters for future sales conversations?
12. Do you track which specific line items from a quotation resulted in which actual delivered machines?
13. How detailed does installation tracking need to be — just dates, or also technical setup details?
14. Is training tracked separately from installation, or typically bundled as one event?
15. Who needs to see machine ownership data — sales (for expansion conversations), service (for support), management (for reporting), or all three?

---

## Sector 7 — Service & Maintenance (V4)
*(What happens after the sale)*

1. How do service requests currently come in — phone call, WhatsApp, in person?
2. Who decides which engineer gets assigned to a service request?
3. What's the typical response time expectation from the customer's side?
4. Is there a way to prioritize urgent breakdowns (production-stopping) vs. minor issues today?
5. How is a service request currently "closed" — is there a formal sign-off, or just informal confirmation it's fixed?
6. Do you track parts used/replaced during a service visit?
7. Is there a recurring-issue pattern worth tracking (same machine breaking down repeatedly)?
8. How far in advance does the team currently know about upcoming warranty expirations, if at all?
9. Is proactive maintenance ever offered, or is service purely reactive/on-request today?
10. Would engineers actually use a mobile "my tasks" view in the field, or do they coordinate entirely by phone currently?

---

## Sector 8 — Management & Reporting Needs
*(What leadership actually wants to see, versus what a generic dashboard assumes they want)*

1. What question do you, as a manager/owner, currently have to phone someone to get answered?
2. If you checked one screen every morning, what would you want it to tell you?
3. What number or metric do you currently track (even informally) that isn't in the current PRD at all?
4. How do you currently know if a salesperson is underperforming or overperforming — what do you look at?
5. Is total sales revenue tracked anywhere accessible today, or does that live entirely in accounting/separate records?
6. What's the single most useful report you wish existed right now but doesn't?
7. Do you need to report anything upward to China HQ regularly? What does that report currently contain?
8. Is there a "factories we haven't touched in X days" concern that already worries you today?
9. What would make you trust a dashboard number over your gut feeling from talking to the team?
10. If this system only gave you one dashboard tile and nothing else, which one would you insist on keeping?
