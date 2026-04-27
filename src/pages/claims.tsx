// This function runs at BUILD TIME on the server
// The browser never sees this code
export async function getStaticProps() {
  const claimTypes = [
    {
      id: 1,
      title: 'Report Damage',
      description: 'Collisions, Fire, Mechanical Issues, Theft',
    },
    {
      id: 2,
      title: 'Request a Reimbursement',
      description: 'Cleaning, Gas, Impound Fees, Lost Keys',
    },
    {
      id: 3,
      title: 'Tickets or Tolls',
      description: 'Parking tickets, speeding tickets, toll violations',
    },
  ];

  return {
    props: { claimTypes }, // ← passed to the component below
  };
}

type ClaimType = {
  id: number;
  title: string;
  description: string;
};

// This component receives pre-built props — no useEffect, no loading state
export default function ClaimsPage({
  claimTypes,
}: {
  claimTypes: ClaimType[];
}) {
  return (
    <div>
      <h1>What type of claim are you filing?</h1>
      <div style={{ display: 'flex', gap: '16px' }}>
        {claimTypes.map((claim) => (
          <div
            key={claim.id}
            style={{ border: '1px solid #ccc', padding: '24px' }}>
            <h2>{claim.title}</h2>
            <p>{claim.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
