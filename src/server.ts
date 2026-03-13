import Fastify, { FastifyRequest, FastifyReply } from 'fastify';

// simplified openrtb interfaces for typescript validation
interface Impression {
    id: string;
    bid_floor: number;
}

interface BidRequestPayload {
    id: string;
    imp: Impression[];
}

// disable sync logger for max performance
const app = Fastify({ logger: false });

app.post('/bid', async (request: FastifyRequest<{ Body: BidRequestPayload }>, reply: FastifyReply) => {
    try {
        const bidRequest = request.body;

        // get the first ad impression from the array
        const imp = bidRequest.imp[0];

        // bidder logic: if the publisher asks too much (bid_floor > $2.0), we pass
        if (imp.bid_floor > 2.0) {
            // 204 no content - standard rtb response if we don't participate in the auction
            return reply.code(204).send();
        }

        // if the price is right, build our bid response
        const bidResponse = {
            id: bidRequest.id,
            seat_bid: [{
                bid: [{
                    id: `bid-${Math.floor(Math.random() * 10000)}`, // unique id for our bid
                    imp_id: imp.id,
                    price: 2.10, // our bid price (slightly higher than bid_floor)
                    adm: '<div><a href="https://oleksiistepaniak.com">Oleksii Stepaniak - Software Engineer!</a></div>', // our ad banner/markup
                    cr_id: 'creative-123'
                }]
            }],
            cur: 'USD'
        };

        // send the bid response
        return reply.send(bidResponse);

    } catch (error) {
        // in adtech, it's better to return nothing than to crash or timeout
        return reply.code(204).send();
    }
});

// start the server
const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log('🚀 rtb bidder poc is running extremely fast on http://localhost:3000');
    } catch (err) {
        process.exit(1);
    }
};

start().finally();
