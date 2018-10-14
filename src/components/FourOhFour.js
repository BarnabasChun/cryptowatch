import React from 'react';
import Link from 'react-router-dom/Link';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Wrapper } from './utils';

const FourOhFourWrapper = styled(Wrapper)`
  padding: 60px 0;
`;

const FourOhFour = () => (
  <FourOhFourWrapper>
    <Typography variant="headline" gutterBottom>
      404 Page Not Found
    </Typography>
    <Typography variant="subheading" gutterBottom>
      Oops, looks like you got lost! The page you are looking for was moved, removed, or might never
      existed.
    </Typography>
    <Link to="/">
      <Button color="primary" variant="contained">
        Back Home
      </Button>
    </Link>
  </FourOhFourWrapper>
);

export default FourOhFour;
