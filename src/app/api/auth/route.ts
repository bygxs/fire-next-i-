// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '../../lib/firebase-admin'; // Use the pre-initialized Firebase Admin instance

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Return success response
    return NextResponse.json({ message: 'Access granted', user: decodedToken }, { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}