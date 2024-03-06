import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
// import { ThemeProvider } from "@mui/material";
// import customTheme from "~/utils/customThemeMUI";
// import { CssVarsProvider } from "@mui/joy";

import {experimental_extendTheme as materialExtendTheme, Experimental_CssVarsProvider as MaterialCssVarsProvider, THEME_ID as MATERIAL_THEME_ID,} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { StyledEngineProvider } from '@mui/material/styles';


const materialTheme = materialExtendTheme();
    
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* <StyledEngineProvider injectFirst> */}
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }} defaultMode='light'>
              <JoyCssVarsProvider defaultMode='light'>
                <CssBaseline enableColorScheme />
                <Component {...pageProps} />
              </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      {/* </StyledEngineProvider> */}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
