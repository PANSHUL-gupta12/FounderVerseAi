export async function simulateStartup(formData: any) {
  const response = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'startup', formData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate simulation.");
  }
  
  return await response.json();
}

export async function simulateDecision(params: { idea: string, currentState: string, revenue: string, teamSize: string, stage: string, decision: string }) {
  const response = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'decision', formData: params }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate decision outcomes.");
  }
  
  return await response.json();
}
