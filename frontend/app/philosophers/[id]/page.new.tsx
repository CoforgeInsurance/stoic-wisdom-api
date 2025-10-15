import PhilosopherClient from './PhilosopherClient';

// Generate static params for all philosophers
export async function generateStaticParams() {
  // For static export, pre-define the philosopher IDs (1, 2, 3)
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function PhilosopherDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return <PhilosopherClient params={params} />;
}
