import { Suspense } from 'react';
//import BlogList from '@/components/BlogList';
interface Post {
  id: number;
  title: string;
}

//== Server component
export default async function Page() {
  return (
    <div>
      <h1>Welcome to the Blog</h1>
      <Suspense fallback={<p>...loading</p>}>
        <BlogList />
      </Suspense>
    </div>
  );
}
//==Server component
const BlogList = async () => {
  const data = await fetch('https://api.vercel.app/blog');
  const posts = await data.json();
  return (
    <div>
      <ul>
        {posts.map(({ id, title }: Post) => (
          <li key={id}>
            {id}, {title}
          </li>
        ))}
      </ul>
    </div>
  );
};
