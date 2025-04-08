// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '../../lib/firebase-admin'; // Use the pre-initialized Firebase Admin instance
export async function POST(req) {
    try {
        const { email, password } = await req.json();
        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        // Check if user already exists
        try {
            const existingUser = await adminAuth.getUserByEmail(email);
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }
        catch (error) {
            // User does not exist, proceed with creation
        }
        // Create user with Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
        });
        return NextResponse.json({ message: 'User created successfully', userId: userRecord.uid }, { status: 201 });
    }
    catch (error) {
        console.error('Sign-up error:', error);
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }
        if (error.code === 'auth/invalid-email') {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }
        if (error.code === 'auth/weak-password') {
            return NextResponse.json({ error: 'Password is too weak' }, { status: 400 });
        }
        // Generic error response
        return NextResponse.json({ error: 'Failed to create user. Please try again later.' }, { status: 500 });
    }
}
