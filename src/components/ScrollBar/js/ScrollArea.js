import React from 'react';
import PropTypes from 'prop-types';
import lineHeight from 'line-height';
import { Motion, spring } from 'react-motion';
import ScrollBar from './Scrollbar';
import {
  findDOMNode,
  warnAboutFunctionChild,
  positiveOrZero,
  modifyObjValues,
} from './utils';

const eventTypes = {
  wheel: 'wheel',
  api: 'api',
  touch: 'touch',
  touchEnd: 'touchEnd',
  mousemove: 'mousemove',
};

export default class ScrollArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topPosition: 0,
      leftPosition: 0,
      realHeight: 0,
      containerHeight: 0,
      realWidth: 0,
      containerWidth: 0,
    };

    this.scrollArea = {
      refresh: () => {
        this.setSizesToState();
      },
      scrollTop: () => {
        this.scrollTop();
      },
      scrollBottom: () => {
        this.scrollBottom();
      },
      scrollYTo: position => {
        this.scrollYTo(position);
      },
      scrollLeft: () => {
        this.scrollLeft();
      },
      scrollRight: () => {
        this.scrollRight();
      },
      scrollXTo: position => {
        this.scrollXTo(position);
      },
    };

    this.evntsPreviousValues = {
      clientX: 0,
      clientY: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
  }

  getChildContext() {
    return {
      scrollArea: this.scrollArea,
    };
  }

  componentDidMount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.addEventListener(
        'resize',
        this.bindedHandleWindowResize,
      );
    }
    this.lineHeightPx = lineHeight(findDOMNode(this.content));
    this.setSizesToState();
  }

  componentWillUnmount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.removeEventListener(
        'resize',
        this.bindedHandleWindowResize,
      );
    }
  }

  componentDidUpdate() {
    this.setSizesToState();
  }

  render() {
    let { children, className, contentClassName, ownerDocument } = this.props;
    const withMotion =
      this.props.smoothScrolling &&
      (this.state.eventType === eventTypes.wheel ||
        this.state.eventType === eventTypes.api ||
        this.state.eventType === eventTypes.touchEnd);

    const scrollbarY = this.canScrollY() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realHeight}
        containerSize={this.state.containerHeight}
        position={this.state.topPosition}
        onMove={this.handleScrollbarMove.bind(this)}
        onPositionChange={this.handleScrollbarYPositionChange.bind(this)}
        containerStyle={this.props.verticalContainerStyle}
        scrollbarStyle={this.props.verticalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        type="vertical"
      />
    ) : null;

    const scrollbarX = this.canScrollX() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realWidth}
        containerSize={this.state.containerWidth}
        position={this.state.leftPosition}
        onMove={this.handleScrollbarMove.bind(this)}
        onPositionChange={this.handleScrollbarXPositionChange.bind(this)}
        containerStyle={this.props.horizontalContainerStyle}
        scrollbarStyle={this.props.horizontalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        type="horizontal"
      />
    ) : null;

    if (typeof children === 'function') {
      warnAboutFunctionChild();
      children = children();
    }

    const classes = `scrollarea ${className || ''}`;
    const contentClasses = `scrollarea-content ${contentClassName || ''}`;

    const contentStyle = {
      marginTop: -this.state.topPosition,
      marginLeft: -this.state.leftPosition,
    };
    const springifiedContentStyle = withMotion
      ? modifyObjValues(contentStyle, x => spring(x))
      : contentStyle;

    return (
      <Motion
        style={{ ...this.props.contentStyle, ...springifiedContentStyle }}
      >
        {style => (
          <div
            ref={x => (this.wrapper = x)}
            style={this.props.style}
            className={classes}
            onWheel={this.handleWheel.bind(this)}
          >
            <div
              ref={x => (this.content = x)}
              style={style}
              className={contentClasses}
              onTouchStart={this.handleTouchStart.bind(this)}
              onTouchMove={this.handleTouchMove.bind(this)}
              onTouchEnd={this.handleTouchEnd.bind(this)}
            >
              {children}
              <div ref={x => (this.bottom = x)} />
            </div>
            {scrollbarY}
            {scrollbarX}
          </div>
        )}
      </Motion>
    );
  }

  setStateFromEvent(newState, eventType) {
    if (this.props.onScroll) {
      this.props.onScroll(newState);
    }
    this.setState({ ...newState, eventType });
  }

  handleTouchStart(e) {
    const { touches } = e;
    if (touches.length === 1) {
      const { clientX, clientY } = touches[0];
      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        clientY,
        clientX,
        timestamp: Date.now(),
      };
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    const { touches } = e;
    if (touches.length === 1) {
      const { clientX, clientY } = touches[0];

      const deltaY = this.eventPreviousValues.clientY - clientY;
      const deltaX = this.eventPreviousValues.clientX - clientX;

      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        deltaY,
        deltaX,
        clientY,
        clientX,
        timestamp: Date.now(),
      };

      this.setStateFromEvent(this.composeNewState(-deltaX, -deltaY));
    }
  }

  handleTouchEnd(e) {
    let { deltaX, deltaY, timestamp } = this.eventPreviousValues;
    if (typeof deltaX === 'undefined') deltaX = 0;
    if (typeof deltaY === 'undefined') deltaY = 0;
    if (Date.now() - timestamp < 200) {
      this.setStateFromEvent(
        this.composeNewState(-deltaX * 10, -deltaY * 10),
        eventTypes.touchEnd,
      );
    }

    this.eventPreviousValues = {
      ...this.eventPreviousValues,
      deltaY: 0,
      deltaX: 0,
    };
  }

  handleScrollbarMove(deltaY, deltaX) {
    this.setStateFromEvent(this.composeNewState(deltaX, deltaY));
  }

  handleScrollbarXPositionChange(position) {
    this.scrollXTo(position);
  }

  handleScrollbarYPositionChange(position) {
    this.scrollYTo(position);
  }

  handleWheel(e) {
    let deltaY = e.deltaY;
    let deltaX = e.deltaX;

    if (this.props.swapWheelAxes) {
      [deltaY, deltaX] = [deltaX, deltaY];
    }

    /*
         * WheelEvent.deltaMode can differ between browsers and must be normalized
         * e.deltaMode === 0: The delta values are specified in pixels
         * e.deltaMode === 1: The delta values are specified in lines
         * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
         */
    if (e.deltaMode === 1) {
      deltaY *= this.lineHeightPx;
      deltaX *= this.lineHeightPx;
    }

    deltaY *= this.props.speed;
    deltaX *= this.props.speed;

    const newState = this.composeNewState(-deltaX, -deltaY);

    if (
      (newState.topPosition &&
        this.state.topPosition !== newState.topPosition) ||
      (newState.leftPosition &&
        this.state.leftPosition !== newState.leftPosition) ||
      this.props.stopScrollPropagation
    ) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setStateFromEvent(newState, eventTypes.wheel);
  }

  handleWindowResize() {
    let newState = this.computeSizes();
    newState = this.getModifiedPositionsIfNeeded(newState);
    this.setStateFromEvent(newState);
  }

  composeNewState(deltaX, deltaY) {
    const newState = this.computeSizes();

    if (this.canScrollY(newState)) {
      newState.topPosition = this.computeTopPosition(deltaY, newState);
    }
    if (this.canScrollX(newState)) {
      newState.leftPosition = this.computeLeftPosition(deltaX, newState);
    }

    return newState;
  }

  computeTopPosition(deltaY, sizes) {
    const newTopPosition = this.state.topPosition - deltaY;
    return this.normalizeTopPosition(newTopPosition, sizes);
  }

  computeLeftPosition(deltaX, sizes) {
    const newLeftPosition = this.state.leftPosition - deltaX;
    return this.normalizeLeftPosition(newLeftPosition, sizes);
  }

  normalizeTopPosition(newTopPosition, sizes) {
    if (newTopPosition > sizes.realHeight - sizes.containerHeight) {
      newTopPosition = sizes.realHeight - sizes.containerHeight;
    }
    if (newTopPosition < 0) {
      newTopPosition = 0;
    }
    return newTopPosition;
  }

  normalizeLeftPosition(newLeftPosition, sizes) {
    if (newLeftPosition > sizes.realWidth - sizes.containerWidth) {
      newLeftPosition = sizes.realWidth - sizes.containerWidth;
    } else if (newLeftPosition < 0) {
      newLeftPosition = 0;
    }

    return newLeftPosition;
  }

  computeSizes() {
    // let realHeight = this.content.offsetHeight;
    const realHeight = this.bottom.offsetTop;
    const containerHeight = this.wrapper.offsetHeight;
    const realWidth = this.content.offsetWidth;
    const containerWidth = this.wrapper.offsetWidth;

    return {
      realHeight,
      containerHeight,
      realWidth,
      containerWidth,
    };
  }

  setSizesToState() {
    const sizes = this.computeSizes();
    if (
      sizes.realHeight !== this.state.realHeight ||
      sizes.realWidth !== this.state.realWidth
    ) {
      this.setStateFromEvent(this.getModifiedPositionsIfNeeded(sizes));
    }
  }

  scrollTop() {
    this.scrollYTo(0);
  }

  scrollBottom() {
    this.scrollYTo(this.state.realHeight - this.state.containerHeight);
  }

  scrollLeft() {
    this.scrollXTo(0);
  }

  scrollRight() {
    this.scrollXTo(this.state.realWidth - this.state.containerWidth);
  }

  scrollYTo(topPosition) {
    if (this.canScrollY()) {
      const position = this.normalizeTopPosition(
        topPosition,
        this.computeSizes(),
      );
      this.setStateFromEvent({ topPosition: position }, eventTypes.api);
    }
  }

  scrollXTo(leftPosition) {
    if (this.canScrollX()) {
      const position = this.normalizeLeftPosition(
        leftPosition,
        this.computeSizes(),
      );
      this.setStateFromEvent({ leftPosition: position }, eventTypes.api);
    }
  }

  canScrollY(state = this.state) {
    const scrollableY = state.realHeight > state.containerHeight;
    return scrollableY && this.props.vertical;
  }

  canScrollX(state = this.state) {
    const scrollableX = state.realWidth > state.containerWidth;
    return scrollableX && this.props.horizontal;
  }

  getModifiedPositionsIfNeeded(newState) {
    const bottomPosition = newState.realHeight - newState.containerHeight;
    if (this.state.topPosition >= bottomPosition) {
      newState.topPosition = this.canScrollY(newState)
        ? positiveOrZero(bottomPosition)
        : 0;
    }

    const rightPosition = newState.realWidth - newState.containerWidth;
    if (this.state.leftPosition >= rightPosition) {
      newState.leftPosition = this.canScrollX(newState)
        ? positiveOrZero(rightPosition)
        : 0;
    }

    return newState;
  }
}

ScrollArea.childContextTypes = {
  scrollArea: PropTypes.object,
};

ScrollArea.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  speed: PropTypes.number,
  contentClassName: PropTypes.string,
  contentStyle: PropTypes.object,
  vertical: PropTypes.bool,
  verticalContainerStyle: PropTypes.object,
  verticalScrollbarStyle: PropTypes.object,
  horizontal: PropTypes.bool,
  horizontalContainerStyle: PropTypes.object,
  horizontalScrollbarStyle: PropTypes.object,
  onScroll: PropTypes.func,
  contentWindow: PropTypes.any,
  ownerDocument: PropTypes.any,
  smoothScrolling: PropTypes.bool,
  minScrollSize: PropTypes.number,
  stopScrollPropagation: PropTypes.bool,
  swapWheelAxes: PropTypes.bool,
};

ScrollArea.defaultProps = {
  speed: 1,
  vertical: true,
  horizontal: true,
  smoothScrolling: false,
  swapWheelAxes: false,
  contentWindow: typeof window === 'object' ? window : undefined,
  ownerDocument: typeof document === 'object' ? document : undefined,
};
