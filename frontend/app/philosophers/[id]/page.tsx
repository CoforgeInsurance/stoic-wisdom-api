import PhilosopherClient from './PhilosopherClient';

// Server component: declare static params only, no client libraries imported here
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function PhilosopherDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PhilosopherClient id={params.id} />;
}
