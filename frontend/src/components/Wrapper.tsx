const Wrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) => {
  return (
    <div className='mt-4'>
      <div className='container mx-auto'>{children}</div>
    </div>
  );
};

export default Wrapper;
