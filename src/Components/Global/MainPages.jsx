import BottomNavigator from './BottomNavigator';
import Navbar from './Navbar';
import { useContext, useRef, useEffect } from 'react';
import Home from "../../Pages/Home"
import MyLists from "../../Pages/MyLists"
import ManageLists from "../../Pages/ManageLists"
import { Switch, useLocation } from 'react-router-dom';
import { matchPath } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from 'react';

const paths = [{
  path: "/home/mijn-lijsten",
  id: 0
}, {
  path: "/home",
  id: 1
}, {
  path: "/home/lijsten-beheren",
  id: 2
}];

const MainPages = () => {
  const ref = useRef();
  const location = useLocation();
  const [id, setId] = useState();

  const onScroll = (e) => {
    console.log(e);
    e.stopPropegation();
  }

  useEffect(() => {
    setId(paths.find(options => matchPath(location.pathname, { path: options.path })));
  }, [location])

  useEffect(() => {
    ref.current.scrollLeft = document.body.clientWidth * id;
  }, [id])


  return <>
    <Navbar />
    <div ref={ref} className="horizontal-scroll-pages" onScroll={onScroll}>
      <div className='overflow-page'>
        <SubPage key={"0"} itemId={"0"}><MyLists /></SubPage>
        <SubPage key={"1"} itemId={"1"}><Home /></SubPage>
        <SubPage key={"2"} itemId={"2"}><ManageLists /></SubPage>
      </div>
    </div>
    <BottomNavigator state={id} />
  </>
}

const SubPage = ({ children }) => {
  return <div tabIndex={0} className="swap-page-wrapper">{children}</div>
}

export default MainPages;