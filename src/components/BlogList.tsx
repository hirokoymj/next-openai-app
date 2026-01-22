interface Post {
  id: number;
  title: string;
}

const BlogList = async () => {
  const data = await fetch('https://api.vercel.app/blog');
  const posts = await data.json();
  return (
    <div>
      BlogList
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

export default BlogList;
