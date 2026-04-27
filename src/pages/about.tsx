// This function runs at BUILD TIME on the server
// The browser never sees this code
export async function getStaticProps() {
  const sectionList = [
    {
      id: 1,
      title: 'Recipe Page',
      description: 'App Route, Gemini API',
    },
    {
      id: 2,
      title: 'AI Chat Page',
      description: 'App Router, Gemini API',
    },
    {
      id: 3,
      title: 'Vehicle API Demo Page',
      description: 'Stack: Vehicle API, JSON, useActionState',
    },
    {
      id: 4,
      title: 'User list page ',
      description: 'Stack: REST API',
    },
  ];

  return {
    props: { sectionList }, // ← passed to the component below
  };
}

type Section = {
  id: number;
  title: string;
  description: string;
};

// This component receives pre-built props — no useEffect, no loading state
export default function AboutPage({ sectionList }: { sectionList: Section[] }) {
  return (
    <div>
      <h1>About Page</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sectionList.map((section) => (
          <div
            key={section.id}
            style={{ border: '1px solid #ccc', padding: '24px' }}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <img src="https://placehold.co/800x100" />
          </div>
        ))}
      </div>
    </div>
  );
}
