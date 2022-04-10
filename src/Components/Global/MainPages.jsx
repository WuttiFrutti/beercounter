import BottomNavigator from './BottomNavigator';
import Navbar from './Navbar';
import { useRef, useEffect } from 'react';
import Home from "../../Pages/Home"
import MyLists from "../../Pages/MyLists"
import ManageLists from "../../Pages/ManageLists"
import { useLocation } from 'react-router-dom';
import { matchPath } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHistory } from 'react-router-dom';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import useAnimationFrame from 'use-animation-frame';

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

let currentAnim;

const MainPages = () => {
  const ref = useRef();
  const location = useLocation();
  const [id, setId] = useState();
  // const [newId, setNewId] = useState();
  const history = useHistory();

  const animate = (newId) => {
    if (id === newId) return;

    // const style = document.querySelector(".horizontal-scroll-wrapper").style;
    // // style.right = `${id * 100}vw`;
    // // const style = ref.current.style;
    // window.cancelAnimationFrame(currentAnim);

    // let first, start;

    // const step = (timestamp) => {
    //   if (first !== undefined && start === undefined) {
    //     start = timestamp;
    //   }
    //   if (first === undefined) {
    //     first = timestamp;
    //   }
    //   const percentage = ((timestamp - start) / 2) / 100;

    //   console.log(percentage);
    //   if (timestamp >= start + 200) {
    //     style.right = `${newId * 100}vw`;
    //   } else {
    //     style.right = `${(((newId - id) * percentage) + id) * 100}vw`
    //     currentAnim = window.requestAnimationFrame(step)
    //   }
    // }

    // currentAnim = window.requestAnimationFrame(step);
    ref.current.scrollToItem(ref.current.getItemElementById(newId));

  }

  useEffect(() => {
    const { id } = paths.find(options => matchPath(location.pathname, { path: options.path, exact: true }));
    animate(id);
    setId(id);
  }, [location])



  const swipe = ({ dir }) => {
    const path = paths[dir === "Left" ? id + 1 : id - 1];
    if (path) {
      history.replace(path.path);
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: swipe,
    onSwipedRight: swipe
  });



  // useEffect(() => {
  //   ref.current.scrollToItem(ref.current.getItemElementById(id));
  // }, [id]);


  // useAnimationFrame(e => {
  //   const style = ref.current.style;

  //   if(e.time >= 500){
  //     style.right = `${id * 100}vw`;
  //   }else{
  //     style.right = `${(id * 100)}vw`
  //   }
  // });



  return <>
    <Navbar />
    <div {...handlers}>
      {/* <div ref={ref} className='horizontal-scroll-wrapper'> */}

      <ScrollMenu apiRef={ref} transitionDuration={id === undefined ? 0 : 500}>
        <SubPage key={0} itemId={0}><MyLists /></SubPage>
        <SubPage key={1} itemId={1}><Home /></SubPage>
        <SubPage key={2} itemId={2}><ManageLists /></SubPage>
      </ScrollMenu>
      {/* </div> */}
    </div>

    <BottomNavigator state={id} paths={paths} />
  </>
}

const SubPage = ({ children }) => {
  return <div tabIndex={0} className="swap-page-wrapper">{children}</div>
}

export default MainPages;