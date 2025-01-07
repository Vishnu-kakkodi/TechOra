const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen(); 
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };
  
 export default exitFullScreen;
  