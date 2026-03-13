# ⚡ High-Performance RTB Bidder PoC

A lightning-fast Proof of Concept (PoC) for an AdTech Real-Time Bidding (RTB) engine. Built to handle OpenRTB bid requests with sub-millisecond latency.

## 🎯 Objective
In the AdTech ecosystem, every millisecond counts. This microservice demonstrates how to process incoming Bid Requests, evaluate `bidfloor` thresholds, and return a valid Bid Response (or `204 No Content`) using a highly optimized Node.js setup.

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** [Fastify](https://www.fastify.io/) (chosen for its extremely low overhead and high routing performance)
* **Language:** TypeScript (for robust OpenRTB payload validation and developer experience)

## 🚀 Performance Highlights
* **Synchronous Logging Disabled:** Standard I/O operations block the Node.js Event Loop. Built-in logging is turned off here to ensure maximum throughput under high load.
* **Graceful Degradation:** In programmatic advertising, missing an auction is always better than crashing the service or returning malformed data. The `catch` block guarantees a safe `204 No Content` fallback.
* **Fastify Architecture:** Leverages Fastify's internal architecture to maximize requests-per-second (RPS) capacity without memory leaks.

## 🚦 How to Run Locally

1. **Clone the repository:**
```bash
git clone https://github.com/oleksiistepaniak/spalah-rtb-bidder-poc.git
cd spalah-rtb-bidder-poc
```
2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```
The server will start instantly on http://localhost:3000

## 🧪 Testing the Bidder
You can simulate a publisher sending a mock OpenRTB Bid Request using `curl`:

**Test 1: Valid Bid (bid_floor < $2.00)**
```bash
curl -i -X POST http://localhost:3000/bid \
-H "Content-Type: application/json" \
-d '{
  "id": "req-12345",
  "imp": [
    {
      "id": "imp-1",
      "bid_floor": 1.50
    }
  ]
}'
```
**Expected Output**: Since the `bid_floor` (1.50 USD) is lower than our max threshold (2.00 USD), the bidder responds with a valid bid (`price: 2.10`) and ad markup.

**Test 2: Ignored Bid (bid_floor > $2.00)**
```bash
curl -i -X POST http://localhost:3000/bid \
-H "Content-Type: application/json" \
-d '{
  "id": "req-99999",
  "imp": [
    {
      "id": "imp-2",
      "bidfloor": 2.50
    }
  ]
}'
```
**Expected Output**: A lightning-fast `HTTP 204 No Content` response, conserving bandwidth and skipping the expensive auction.

**Author:** [Oleksii Stepaniak](https://oleksiistepaniak.com)
