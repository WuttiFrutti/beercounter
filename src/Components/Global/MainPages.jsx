import BottomNavigator from './BottomNavigator';
import Navbar from './Navbar';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { useContext, useRef, useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import Home from "../../Pages/Home"
import MyLists from "../../Pages/MyLists"
import ManageLists from "../../Pages/ManageLists"


const localPages = {
    "/mijn-lijsten": 0,
    "/": 1,
    "/lijsten-beheren": 2
  }
  
  
  const MainPages = ({ options, match }) => {
    const ref = useRef();
  
  
    const onScroll = (apiObj, ev) => {
      ev.stopPropagation();
      if (ev.deltaX < -25) {
        apiObj.scrollPrev();
      } else if (ev.deltaX > 25) {
        apiObj.scrollNext();
      }
    }
  
  
    useEffect(() => {
      const el = ref.current.scrollContainer.current;
  
      let touchstartX = 0;
      let touchendX = 0;
      let touchstartY = 0;
      let touchendY = 0;
  
  
      const handleGesture = () => {
        if(Math.abs(touchendY - touchstartY) < 40){
          const diff = touchendX - touchstartX;
          if(diff > 25) ref.current.scrollPrev();
          if(diff < -25) ref.current.scrollNext();
  
        }
      }
  
      const startListener = el.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
      })
  
      const endListener = el.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX
        touchendY = e.changedTouches[0].screenY
        handleGesture()
      })
  
      el.scrollLeft = el.clientWidth * localPages[match.path];
  
      return () => {
        el.removeEventListener("touchstart", startListener);
        el.removeEventListener("touchend", endListener);
      }
    }, [ref])
  
    return <>
      <Navbar />
      <ScrollMenu apiRef={ref} onWheel={onScroll} LeftArrow={<BottomNavigator />}>
        <SubPage key={"0"} itemId={"0"}><MyLists /></SubPage>
        <SubPage key={"1"} itemId={"1"}><Home /></SubPage>
        <SubPage key={"2"} itemId={"2"}><ManageLists /></SubPage>
      </ScrollMenu>
    </>
  }
  
  const SubPage = ({ children }) => {
    const { visibleItemsWithoutSeparators } = useContext(VisibilityContext);
    const history = useHistory();
    const location = useLocation();
    const [visible] = visibleItemsWithoutSeparators;
  
    useEffect(() => {
      if(localPages[location.pathname] !== parseInt(visible)){
        const path = Object.keys(localPages)[visible];
        if(path) history.push(path);
      }
    },[visibleItemsWithoutSeparators, location, history, visible])
  
    return <div tabIndex={0} className="swap-page-wrapper">{children}</div>
  }

export default MainPages;