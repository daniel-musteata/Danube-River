import React, {Component} from "react";
import {MapContextProvider} from "../../context/MapContext";
import Zoomed from "./Zoomed/index";
import Full from "./Full/index";
import Clouds from "./Clouds";
import config from "../../core/config";

const CLOUDS_ANIMATION_TIME = 3000 * 1.1;
const MAP_SWAP_AFTER_ANIMATION_PROGRESS = 0.3;

export default class Map extends Component {
  #timeout = null;

  state = {
    // @todo replace when finished development
    activeMap: 'full',
    activeItem: {...config.articles[4]},
    // activeMap: 'zoomed',
    // activeItem: {...config.articles[0]},
    showCloudsAnimation: false,
  };

  componentWillUnmount() {
    this.#timeout !== null && clearTimeout(this.#timeout);
  }

  #getContext = () => ({
    activeMap: this.state.activeMap,
    activeItem: this.state.activeItem,
    setActiveMap: this.#setActiveMap,
    setActiveItem: this.#setActiveItem,
  });

  #setActiveMap = activeMap => {
    // 1. Show clouds animation
    // 2. Just before halfway through clouds animation, set activeMap.
    this.setState({showCloudsAnimation: true});
    this.#timeout = setTimeout(() => {
      this.setState({activeMap});

      this.#timeout = setTimeout(() => {
        this.setState({showCloudsAnimation: false});
      }, CLOUDS_ANIMATION_TIME * (1 - MAP_SWAP_AFTER_ANIMATION_PROGRESS));
    }, CLOUDS_ANIMATION_TIME * MAP_SWAP_AFTER_ANIMATION_PROGRESS);
  };

  #setActiveItem = activeItem => {
    this.setState({activeItem});
  };

  #handleHotSpotClick = async index => {
    await this.setState({activeItem: {...config.articles[index]}});
    this.#setActiveMap('full');
  };

  render() {
    return (
      <MapContextProvider value={this.#getContext()}>
        <div className="Map">
          {this.state.showCloudsAnimation && <Clouds/>}
          {this.state.activeMap === 'zoomed' && <Zoomed onHotSpotClick={this.#handleHotSpotClick}/>}
          {this.state.activeMap === 'full' && <Full activeItem={this.state.activeItem}/>}
        </div>
      </MapContextProvider>
    );
  }
}
