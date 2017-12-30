import React from "react";
import Chip from "material-ui/Chip";
import { withStyles } from "material-ui/styles";
import Avatar from "material-ui/Avatar";
import FaceIcon from "material-ui-icons/Face";
import red from "material-ui/colors/red";
import Chat from "twilio-chat";
import Typography from "material-ui/Typography";

const axios = require("axios");
const styles = theme => ({
  chip: {
    margin: theme.spacing.unit
  },
  svgIcon: {
    color: red[200]
  },
  row: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  }
});
class ContectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chipData: [
        { key: 0, label: "Angular" },
        { key: 1, label: "JQuery" },
        { key: 2, label: "Polymer" },
        { key: 3, label: "ReactJS" },
        { key: 4, label: "Vue.js" }
      ]
    };
  }

  componentDidMount() {}

  handleDelete = data => () => {
    const chipData = [...this.state.chipData];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.setState({ chipData });
  };

  render() {
    const classes = this.props;
    console.log("render page.");
    return (
      <div id="contects" className={classes.row}>
        {this.state.chipData.map(data => {
          return (
            <Chip
              avatar={
                <Avatar>
                  <FaceIcon className={classes.svgIcon} />
                </Avatar>
              }
              label={data.label}
              key={data.key}
              onDelete={this.handleDelete(data)}
              className={classes.chip}
            />
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(ContectList);
