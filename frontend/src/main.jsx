import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemeProvider from './context/ThemeContext.jsx'
import { MessageCardProvider } from './context/MessageCardContext.jsx'
import { GlobalStorageContextProvider } from './context/GlobalStorageContext.jsx'
import ModalDisplayer from './components/modals/ModalDisplayer.jsx'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from './context/ModalContext.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>	
			<MessageCardProvider>
				<ThemeProvider>
					<ModalProvider>
						<GlobalStorageContextProvider>
							<ModalDisplayer/>
							<App />
						</GlobalStorageContextProvider>
					</ModalProvider>
				</ThemeProvider>
			</MessageCardProvider>
		</QueryClientProvider>
	</StrictMode>,
)
