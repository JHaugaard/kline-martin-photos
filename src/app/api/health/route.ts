import { NextResponse } from 'next/server'

/**
 * Health Check Endpoint
 *
 * Route: /api/health
 *
 * Simple endpoint for monitoring and load balancer health checks.
 * Returns 200 OK if the service is running.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
