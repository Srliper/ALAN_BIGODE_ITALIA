export function toast({ title, description, variant }: { title: string; description?: string; variant?: 'destructive' }) {
  // Minimal toast for now — logs to console. Integrate a real toast later.
  console.log('Toast:', { title, description, variant });
}

export default toast;
