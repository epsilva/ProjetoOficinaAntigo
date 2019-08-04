import React from "react";
import { elastic as Menu } from "react-burger-menu";
import Divider from "@material-ui/core/Divider";
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import IconButton from "@material-ui/core/IconButton";
import ConfigIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import DomainIcon from "@material-ui/icons/Domain";

class SideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }

  handlerClickNextPage(page) {
    window.location = page;
  }

  render() {
    return (
      <Menu>
        <MenuList style={{ width: '250px' }}>
          <MenuItem className="menu-item" onClick={() => this.handlerClickNextPage('/home')}>
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
            <h1>My.Code-Dev</h1>
          </MenuItem>
          <br />
          <MenuItem className="menu-item" onClick={() => this.handlerClickNextPage('workShop')}>
            <IconButton color="inherit">
              <DomainIcon />
            </IconButton>
            <p>Minha Oficina</p>
          </MenuItem>

        </MenuList>
        <Divider style={{ width: '250px' }} />
        <MenuList style={{ width: '250px' }}>
          <MenuItem className="menu-item" onClick={() => this.handlerClickNextPage('/config')}>
            <IconButton color="inherit">
              <ConfigIcon />
            </IconButton>
            <p>Configurações</p>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }
};

export default SideBar;