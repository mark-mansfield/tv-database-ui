import { Puff } from 'react-loader-spinner';
import './style.scss';
export const Loader = () => {
  return (
    <div className="loader__wrapper">
      <Puff
        height="300"
        width="300"
        radius={1}
        color="#f40612"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};
