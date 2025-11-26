import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create a pending help request
    await prisma.helpRequest.create({
        data: {
            caller_phone: "+15550101",
            caller_name: "Alice Smith",
            question: "How do I reset my password?",
            context: "User is asking about password reset procedure.",
            status: "pending",
            created_at: new Date()
        }
    })

    // Create a resolved help request
    await prisma.helpRequest.create({
        data: {
            caller_phone: "+15550102",
            caller_name: "Bob Jones",
            question: "What are your business hours?",
            context: "User wants to know opening times.",
            status: "resolved",
            supervisor_answer: "We are open 9am to 5pm, Monday to Friday.",
            resolved_at: new Date(),
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        }
    })

    // Create a timed out help request
    await prisma.helpRequest.create({
        data: {
            caller_phone: "+15550103",
            caller_name: "Charlie Brown",
            question: "Can I speak to a human?",
            context: "User is frustrated.",
            status: "timeout",
            timeout_at: new Date(),
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        }
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
