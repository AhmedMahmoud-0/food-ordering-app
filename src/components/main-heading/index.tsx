function MainHeading({ title, subTitle }: { title: string; subTitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="section-eyebrow">{subTitle}</span>
      <h2 className="section-title">{title}</h2>
      <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-primary" />
    </div>
  );
}

export default MainHeading;
