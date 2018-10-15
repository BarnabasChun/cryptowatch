import React from 'react';
import Link from 'react-router-dom/Link';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const LogoLink = styled(Link)`
  color: inherit;
  text-transform: uppercase;
  text-decoration: none;
`;

const Logo = ({ className }) => (
  <LogoLink to="/" className={className}>
    <Typography variant="headline" color="inherit">
      Cryptowatch
    </Typography>
  </LogoLink>
);

export default Logo;
