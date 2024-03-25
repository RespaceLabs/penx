import { useState } from 'react';
import { Box } from '@fower/react';
import { Button, Input, Spinner } from 'uikit';
import { useLoginByToken } from '@penx/hooks';
import { Logo } from '@penx/widget';

export function DesktopHome() {
  const [token, setToken] = useState('');
  const { login } = useLoginByToken();
  // const { push } = useRouter()
  const [loading, setLoading] = useState(false);

  return (
    <Box bgWhite black bgGray900--dark minH-100vh pt4 w-100p>
      <Box mx-auto className="nav" toCenter py3 px={[18, 0]}>
        <Logo />
      </Box>
      <Box toCenter column mb-80 minH-70vh>
        <Box fontBold text3XL mb6>
          Login to PenX
        </Box>

        <Box column toCenterX gap2 mb4>
          <Box gray600 textXL w-60p textCenter>
            Login to https://penx.io，get a token from user settings，then use
            token to login to App
          </Box>
        </Box>

        <Box column gap-12 mb4 toCenter w-360 mt8>
          <Input
            size="lg"
            placeholder="Your personal token"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
          <Button
            size="lg"
            w-100p
            disabled={loading}
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              try {
                await login(token);
                // push('/editor')
              } catch (error) {
                //
              }
            }}
          >
            {loading && <Spinner white />}
            <Box>Login</Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
