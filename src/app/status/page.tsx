
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { ai } from '@/ai/genkit';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'unknown';

interface StatusIndicatorProps {
  status: ServiceStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    operational: {
      Icon: CheckCircle,
      color: 'text-green-500',
      text: 'Operativo',
    },
    degraded: {
      Icon: AlertCircle,
      color: 'text-yellow-500',
      text: 'Rendimiento Degradado',
    },
    outage: {
      Icon: AlertCircle,
      color: 'text-red-500',
      text: 'Inactivo',
    },
    unknown: {
      Icon: HelpCircle,
      color: 'text-gray-500',
      text: 'Desconocido',
    },
  };

  const { Icon, color, text } = statusConfig[status];

  return (
    <div className="flex items-center">
      <Icon className={`mr-2 h-4 w-4 ${color}`} />
      <span className={color}>{text}</span>
    </div>
  );
};

const ServiceRow = ({ name, statusFetcher }: { name: string, statusFetcher: () => Promise<ServiceStatus> }) => (
  <div className="flex justify-between items-center py-4 border-b border-white/10">
    <span className="text-white">{name}</span>
    <Suspense fallback={<Skeleton className="h-6 w-28" />}>
      <ServiceStatusCheck statusFetcher={statusFetcher} />
    </Suspense>
  </div>
);

const ServiceStatusCheck = async ({ statusFetcher }: { statusFetcher: () => Promise<ServiceStatus> }) => {
  const status = await statusFetcher();
  return <StatusIndicator status={status} />;
};


const checkSupabaseDb = async (): Promise<ServiceStatus> => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    return 'operational';
  } catch (error) {
    console.error("Supabase DB Check Error:", error);
    return 'outage';
  }
};

const checkSupabaseAuth = async (): Promise<ServiceStatus> => {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) return 'unknown';

        const authHealthUrl = `${supabaseUrl}/auth/v1/health`;
        const response = await fetch(authHealthUrl, { method: 'GET', cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.description === "Auth service is healthy") {
                return 'operational';
            }
        }
        return 'degraded';
    } catch (error) {
        console.error("Supabase Auth Check Error:", error);
        return 'outage';
    }
};

const checkGoogleAI = async (): Promise<ServiceStatus> => {
  try {
    // Adding a timeout to the AI check to prevent it from blocking for too long
    const aiPromise = ai.generate({ prompt: 'test' });
    const timeoutPromise = new Promise<ServiceStatus>((_, reject) => setTimeout(() => reject(new Error('AI check timed out')), 5000));
    
    // @ts-ignore
    const result: { text: string | undefined } = await Promise.race([aiPromise, timeoutPromise]);

    if (result.text) {
      return 'operational';
    }
    return 'degraded';
  } catch (error) {
    console.error("Google AI Check Error:", error);
    if ((error as Error).message === 'AI check timed out') {
      return 'degraded';
    }
    return 'outage';
  }
};

const OverallStatus = async () => {
  const [dbStatus, authStatus, aiStatus] = await Promise.all([
    checkSupabaseDb(),
    checkSupabaseAuth(),
    checkGoogleAI()
  ]);
  const allOperational = dbStatus === 'operational' && authStatus === 'operational' && aiStatus === 'operational';

   return (
    <div className={`mt-4 p-4 rounded-lg flex items-center justify-center ${allOperational ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
        <div className="flex items-center">
            {allOperational ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
            <span>{allOperational ? 'Todos los sistemas operativos.' : 'Uno o más sistemas están experimentando problemas.'}</span>
        </div>
    </div>
  )
}


export default function StatusPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#100518] to-[#08020c] text-white">
       <div className="absolute inset-0 opacity-[.03] bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] bg-repeat"></div>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Estado del Sistema</CardTitle>
            <Suspense fallback={<Skeleton className="h-14 w-full mt-4" />}>
              <OverallStatus />
            </Suspense>
          </CardHeader>
          <CardContent className="px-6 pb-6">
              <ServiceRow name="Aplicación Principal (Bind)" statusFetcher={() => Promise.resolve('operational')} />
              <ServiceRow name="Base de Datos (Supabase)" statusFetcher={checkSupabaseDb} />
              <ServiceRow name="Autenticación (Supabase)" statusFetcher={checkSupabaseAuth} />
              <ServiceRow name="Generación de IA (Google AI)" statusFetcher={checkGoogleAI} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
