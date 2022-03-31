import BottomNavigator from './BottomNavigator';
import Navbar from './Navbar';
import { useContext, useRef, useEffect } from 'react';
import Home from "../../Pages/Home"
import MyLists from "../../Pages/MyLists"
import ManageLists from "../../Pages/ManageLists"
import { Switch, useLocation } from 'react-router-dom';
import { matchPath } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  useEffect(() => {
    const { id } = paths.find(options => matchPath(location.pathname, { path: options.path, exact: true }));
    setId(id);
  }, [location])

  useEffect(() => {
    ref.current.style.transform = `translate(-${id * 33}%)`;
  }, [id, ref]);

  const swipe = ({ dir }) => {
    const path = paths[dir === "Left" ? id + 1 : id - 1];
    if (path) {
      history.push(path.path);
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: swipe,
    onSwipedRight: swipe
  });


  return <>
    <Navbar />
    <div {...handlers}>
      <div ref={ref} className="overflow-page">
        <SubPage key={"0"} itemId={"0"}><MyLists /></SubPage>
        <SubPage key={"1"} itemId={"1"}><Home /></SubPage>
        <SubPage key={"2"} itemId={"2"}><ManageLists /></SubPage>
      </div>
    </div>

    <BottomNavigator state={id} paths={paths} />
  </>
}

const SubPage = ({ children }) => {
  return <div tabIndex={0} className="swap-page-wrapper">{children}</div>
}

export default MainPages;