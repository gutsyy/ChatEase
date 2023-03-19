import { useState, useEffect, MutableRefObject } from "react";

interface ScrollableListProps {
  dataList: any[];
  itemHeight: number;
  containerRef: MutableRefObject<HTMLDivElement>;
  renderItem: (props: any) => JSX.Element;
}

const ScrollableList = ({
  dataList,
  itemHeight,
  containerRef,
  renderItem: RenderItem,
}: ScrollableListProps) => {
  // const [scrollTop, setScrollTop] = useState(0);
  // const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const calculator = () => {
    if (!containerRef.current) {
      return;
    }
    const itemsPerView = Math.ceil(
      containerRef.current.clientHeight / itemHeight
    );
    const startIndex = Math.floor(containerRef.current.scrollTop / itemHeight);
    const endIndex = startIndex + itemsPerView;
    // setStartIndex(startIndex);
    setEndIndex(Math.min(endIndex, dataList.length));
  };

  useEffect(() => {
    calculator();

    const element = containerRef.current;
    element.addEventListener("scroll", calculator);
    window.addEventListener("resize", calculator);
    return () => {
      element.removeEventListener("scroll", calculator);
      window.addEventListener("resize", calculator);
    };
  }, []);

  useEffect(() => {
    calculator();
  }, [dataList]);

  const visibleItems = dataList.slice(0, endIndex);

  return (
    <>
      {/* <div style={{ height: `${startIndex * itemHeight}px` }} /> */}
      {visibleItems.map((item, index) => (
        <RenderItem key={index} {...item} />
      ))}
      <div
        style={{ height: `${(dataList.length - endIndex) * itemHeight}px` }}
      />
    </>
  );
};

export default ScrollableList;
