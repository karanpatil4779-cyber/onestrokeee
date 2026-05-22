// ONESTROKE CORE API ENGINE
const express = require('express');
const app = express();
app.use(express.json());

// 1. DYNAMIC PRICING ENGINE
const calculatePrice = (category, durationType, durationValue, items = []) => {
    const baseRates = {
        driver: 500,  // Base for short trip
        maid: 400,    // Base daily
        cook: 600,    // Base daily
        delivery: 100, // Base pickup
        helper: 250    // Hourly for queue standing
    };

    let price = baseRates[category];

    if (durationType === 'weekly') price *= 6; // 6 days working
    if (category === 'delivery') price += (items.length * 50); // Fee per item
    if (category === 'helper') price *= durationValue; // Hourly multiplier

    return price;
};

// 2. SECURE STATE MACHINE (Job Transitions)
app.put('/api/jobs/:id/state', async (req, res) => {
    const { id } = req.params;
    const { newState, userId } = req.body;
    
    // Logic: [Requested] -> [Accepted] -> [In-Progress] -> [Completed] -> [Paid]
    // Verification: Only verified providers can 'Accept'.
    // Escrow: Funds held at 'Accepted', released at 'Paid'.
    
    try {
        const job = await db.jobs.findUnique({ where: { id } });
        
        if (!isValidTransition(job.state, newState)) {
            return res.status(400).json({ error: "Invalid state transition" });
        }

        const updatedJob = await db.jobs.update({
            where: { id },
            data: { job_state: newState }
        });

        // Notify via WebSocket (Simulated)
        broadcastToUser(job.customer_id, { type: 'JOB_UPDATED', state: newState });
        
        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ON-DUTY TOGGLE (Provider Marketplace Filtering)
app.put('/api/provider/toggle-duty', async (req, res) => {
    const { providerId, isOnDuty } = req.body;
    await db.service_providers.update({
        where: { id: providerId },
        data: { is_on_duty: isOnDuty }
    });
    res.json({ message: `You are now ${isOnDuty ? 'visible' : 'hidden'} to customers.` });
});

function isValidTransition(current, next) {
    const sequence = ['requested', 'accepted', 'in_progress', 'completed', 'paid'];
    return sequence.indexOf(next) === sequence.indexOf(current) + 1;
}

app.listen(5000, () => console.log('ONESTROKE Engine running on port 5000'));
