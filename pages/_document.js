import { Html, Head, Main, NextScript } from 'next/document'

const extraCSS = `
@font-face {
	font-family: 'BBC Reith Sans';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_Bd-subset.woff2") format('woff2');
	font-weight: 500;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Sans';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_ExBd-subset.woff2") format('woff2');
	font-weight: 800;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Sans';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_Rg-subset.woff2") format('woff2');
	font-weight: 300;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Sans';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_It-subset.woff2") format('woff2');
	font-weight: 300;
	font-style: italic;
	font-display: swap;
  }
  @font-face {
	font-family: 'BBC Reith Sans';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_Md-subset.woff2") format('woff2');
	font-weight: 400;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Sans Cd';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSansCd_Rg-subset.woff2") format('woff2');
	font-weight: 300;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Sans Cd';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSansCd_Bd-subset.woff2") format('woff2');
	font-weight: 800;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Serif';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSerif_Bd-subset.woff2") format('woff2');
	font-weight: 500;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Serif';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSerif_ExBd-subset.woff2") format('woff2');
	font-weight: 800;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Serif';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSerif_Rg-subset.woff2") format('woff2');
	font-weight: 300;
	font-style: normal;
  }
  @font-face {
	font-family: 'BBC Reith Serif';
	src: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSerif_It-subset.woff2") format('woff2');
	font-weight: 300;
	font-style: italic;
	font-display: swap;
  }

  main::before {
	background-image: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/bg.svg");
  }

  main .article-page .article-content .standout-intro .pattern.part-one {
	background-image: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-one-red.png");
  }
  main .article-page .article-content .standout-intro .pattern.part-two {
	background-image: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-two-red.png");
  }
  main .article-page .article-content .standout-intro .pattern.part-three {
	background-image: url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-three-red.png");
  }
`

export default function Document () {
	return (
		<Html lang='en'>
			<Head>
				<link rel='apple-touch-icon' sizes='180x180' href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/favicon/apple-touch-icon.png`} />
				<link rel='icon' type='image/png' sizes='32x32' href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/favicon/favicon-32x32.png`} />
				<link rel='icon' type='image/png' sizes='16x16' href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/favicon/favicon-16x16.png`} />

				<link rel='preload' href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/fonts/BBCReithSans_Rg-subset.woff2' as='font`} />

				<meta name='description' content='BBC Research & Development are collaborating with the BBC’s Science Unit, BBC Radio 4 and the University of Salford to study the public’s attitudes to synthetic voices.' />
				<meta property='og:site_name' content='BBC R&D' />
				<meta property='og:title' content='BBC R&D Synthetic Voice and Personality Study' />
				<meta property='og:description' content='BBC Research & Development are collaborating with the BBC’s Science Unit, BBC Radio 4 and the University of Salford to study the public’s attitudes to synthetic voices.' />
				
				<style dangerouslySetInnerHTML={{ __html: extraCSS }} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
