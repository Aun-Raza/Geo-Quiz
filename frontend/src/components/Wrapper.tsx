const Wrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) => {
  return <div className='container mx-auto mt-4'>{children}</div>;
};

export default Wrapper;
