import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

/**
 * Class qui permet l'affichage/input de 
 * la tranche d'age recherchée dans les preferences
 */
class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalles : this.props.intervalle
    }
  }

  handleChange(event, newValue){
    this.props.onSliderAgeChange(newValue);
    this.setState({
      intervalles : newValue
    })
  };
  render(){
    
    
  return (
    <div className=" " style={{width:"33%", marginLeft:"33%"}}>
      <Typography id="range-slider" gutterBottom>
        Tranche d'âge : {this.state.intervalles[0]+"-"+this.state.intervalles[1]+" ans"}
      </Typography>
      <Slider
        min={17}
        max={37}
        value={this.state.intervalles}
        onChange={(event,newValue) => this.handleChange(event,newValue)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </div>
  );
  }
}
export default RangeSlider;