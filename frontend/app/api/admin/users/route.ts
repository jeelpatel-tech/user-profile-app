import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma'

const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "UserProfile";

export async function GET(request: Request) {
    try {
        const response = await prisma.user.findMany();
        return NextResponse.json({
            users: response || [],
            count: response?.length || 0
        });
        // return NextResponse.json({
        //     users: response,
        //     count: response?.Count || 0
        // });
    } catch (error) {
        console.error("DynamoDB Scan Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
