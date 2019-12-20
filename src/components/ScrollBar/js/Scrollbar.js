import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import { modifyObjValues } from './utils';

class ScrollBar extends React.Component {
  constructor(props) {
    super(props);
    const newState = this.calculateState(props);
    this.state = {
      position: newState.position,
      scrollSize: newState.scrollSize,
      isDragging: false,
      lastClientPosition: 0,
    };

    if (props.type === 'vertical') {
      this.bindedHandleMouseMove = this.handleMouseMoveForVertical.bind(this);
    } else {
      this.bindedHandleMouseMove = this.handleMouseMoveForHorizontal.bind(this);
    }

    this.bindedHandleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    if (this.props.ownerDocument) {
      this.props.ownerDocument.addEventListener(
        'mousemove',
        this.bindedHandleMouseMove,
      );
      this.props.ownerDocument.addEventListener(
        'mouseup',
        this.bindedHandleMouseUp,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.calculateState(nextProps));
  }

  componentWillUnmount() {
    if (this.props.ownerDocument) {
      this.props.ownerDocument.removeEventListener(
        'mousemove',
        this.bindedHandleMouseMove,
      );
      this.props.ownerDocument.removeEventListener(
        'mouseup',
        this.bindedHandleMouseUp,
      );
    }
  }

  calculateFractionalPosition(realContentSize, containerSize, contentPosition) {
    const relativeSize = realContentSize - containerSize;

    return 1 - (relativeSize - contentPosition) / relativeSize;
  }

  calculateState(props) {
    const fractionalPosition = this.calculateFractionalPosition(
      props.realSize,
      props.containerSize,
      props.position,
    );
    const proportionalToPageScrollSize =
      props.containerSize * props.containerSize / props.realSize;
    const scrollSize =
      proportionalToPageScrollSize < props.minScrollSize
        ? props.minScrollSize
        : proportionalToPageScrollSize;

    const scrollPosition =
      (props.containerSize - scrollSize) * fractionalPosition;
    return {
      scrollSize,
      position: Math.round(scrollPosition),
    };
  }

  render() {
    const {
      smoothScrolling,
      isDragging,
      type,
      scrollbarStyle,
      containerStyle,
    } = this.props;
    const isVoriziontal = type === 'horizontal';
    const isVertical = type === 'vertical';
    const scrollStyles = this.createScrollStyles();
    const springifiedScrollStyles = smoothScrolling
      ? modifyObjValues(scrollStyles, x => spring(x))
      : scrollStyles;

    const scrollbarClasses = `scrollbar-container ${
      isDragging ? 'active' : ''
    } ${isVoriziontal ? 'horizontal' : ''} ${isVertical ? 'vertical' : ''}`;

    return (
      <Motion style={{ ...scrollbarStyle, ...springifiedScrollStyles }}>
        {style => (
          <div
            className={scrollbarClasses}
            style={containerStyle}
            onMouseDown={this.handleScrollBarContainerClick.bind(this)}
            ref={x => {
              this.scrollbarContainer = x;
            }}
          >
            <div
              className="scrollbar"
              style={style}
              onMouseDown={this.handleMouseDown.bind(this)}
            />
          </div>
        )}
      </Motion>
    );
  }

  handleScrollBarContainerClick(e) {
    e.preventDefault();
    const multiplier = this.computeMultiplier();
    const clientPosition = this.isVertical() ? e.clientY : e.clientX;
    const { top, left } = this.scrollbarContainer.getBoundingClientRect();
    const clientScrollPosition = this.isVertical() ? top : left;

    const position = clientPosition - clientScrollPosition;
    const proportionalToPageScrollSize =
      this.props.containerSize * this.props.containerSize / this.props.realSize;

    this.setState({ isDragging: true, lastClientPosition: clientPosition });
    this.props.onPositionChange(
      (position - proportionalToPageScrollSize / 2) / multiplier,
    );
  }

  handleMouseMoveForHorizontal(e) {
    const multiplier = this.computeMultiplier();

    if (this.state.isDragging) {
      e.preventDefault();
      const deltaX = this.state.lastClientPosition - e.clientX;
      this.setState({ lastClientPosition: e.clientX });
      this.props.onMove(0, deltaX / multiplier);
    }
  }

  handleMouseMoveForVertical(e) {
    const multiplier = this.computeMultiplier();

    if (this.state.isDragging) {
      e.preventDefault();
      const deltaY = this.state.lastClientPosition - e.clientY;
      this.setState({ lastClientPosition: e.clientY });
      this.props.onMove(deltaY / multiplier, 0);
    }
  }

  handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const lastClientPosition = this.isVertical() ? e.clientY : e.clientX;
    this.setState({ isDragging: true, lastClientPosition });
  }

  handleMouseUp(e) {
    e.preventDefault();
    this.setState({ isDragging: false });
  }

  createScrollStyles() {
    if (this.props.type === 'vertical') {
      return {
        height: this.state.scrollSize,
        marginTop: this.state.position,
      };
    }
    return {
      width: this.state.scrollSize,
      marginLeft: this.state.position,
    };
  }

  computeMultiplier() {
    return this.props.containerSize / this.props.realSize;
  }

  isVertical() {
    return this.props.type === 'vertical';
  }
}

ScrollBar.propTypes = {
  onMove: PropTypes.func,
  onPositionChange: PropTypes.func,
  realSize: PropTypes.number,
  containerSize: PropTypes.number,
  position: PropTypes.number,
  containerStyle: PropTypes.object,
  scrollbarStyle: PropTypes.object,
  type: PropTypes.oneOf(['vertical', 'horizontal']),
  ownerDocument: PropTypes.any,
  smoothScrolling: PropTypes.bool,
  minScrollSize: PropTypes.number,
};

ScrollBar.defaultProps = {
  type: 'vertical',
  smoothScrolling: false,
};
export default ScrollBar;
