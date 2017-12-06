import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { subscribe } from 'subscribe-ui-event';
import raf from 'raf';
import canUseDOM from 'src/common/utils/canUseDOM.js';
import viewport from 'src/common/utils/viewport.js';
import injectSheet from 'react-jss';

function mapClamp(curr, lowerFrom, upperFrom, lower, upper) {
  var p = lower + (upper - lower) * (curr - lowerFrom) / (upperFrom - lowerFrom);
  return Math.max(lower, Math.min(upper, p));
}

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    pointerEvents: 'none',
    userSelect: 'none',
    backgroundColor: 'rgba(0,0,0,.3)',
    opacity: 0,
  },
});

class Scrim extends Component {
  startPx = 0;
  endPx = 0;
  height = 0;

  componentDidMount() {
    this._scrollEvent = subscribe('scroll', this.handleScroll, {
      useRAF: true,
      enableScrollInfo: true,
    });

    this._resizeEvent = subscribe('resize', this.handleResize, {
      useRAF: true,
      enableResizeInfo: true,
      throttleRate: 300,
    });

    raf(() => {
      const rect = this.$root.getBoundingClientRect();
      // const top = rect.y + viewport.pageY;
      // const bottom = top + rect.height;

      this.height = rect.height;
      // this.startPx = bottom;
      // this.endPx = bottom + 0.5 * viewport.height;
    });
  }

  componentWillUnmount() {
    this._scrollEvent.unsubscribe();
  }

  handleScroll = () => {
    const start = this.$root.offsetTop;
    const end = start + this.height;

    if (viewport.pageY >= start && viewport.pageY <= end) {
      this.$root.style.opacity = `${mapClamp(viewport.pageY, start, end, 0, 1)}%`;
    }
  };

  handleResize = () => {
    const rect = this.$root.getBoundingClientRect();
    const top = rect.top + viewport.pageY;
    const bottom = top + rect.height;

    this.startPx = bottom;
    this.endPx = bottom + 0.5 * viewport.height;
  };

  render() {
    return <div className={this.props.classes.root} ref={ref => (this.$root = ref)} />;
  }
}

export default injectSheet(styles)(Scrim);
