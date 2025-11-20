import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import logo from 'figma:asset/f80e4d54fed4d5464fb9e70ac865852663d91f1e.png';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    if (email) {
      setShowCode(true);
      // Simulate sending code
      console.log('Código enviado a:', email);
    }
  };

  const handleVerifyCode = () => {
    // Simulate code verification
    if (code.length === 6) {
      onLogin(email);
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google login
    onLogin('usuario@gmail.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <img src={logo} alt="DiabetEX" className="h-20 mx-auto" />
          </div>
          <p className="text-muted-foreground">
            Tu compañero para el control de diabetes tipo 2
          </p>
        </div>

        {!showCode ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
              />
            </div>
            <Button 
              onClick={handleSendCode} 
              className="w-full"
              disabled={!email}
            >
              Enviar código de acceso
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-muted-foreground">
                  o continúa con
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-900">
                  Código enviado a <strong>{email}</strong>
                </p>
                <p className="text-green-700 mt-1">
                  Revisa tu correo e ingresa el código de 6 dígitos
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block mb-2">
                Código de verificación
              </label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                className="text-center tracking-widest"
              />
            </div>

            <Button 
              onClick={handleVerifyCode} 
              className="w-full"
              disabled={code.length !== 6}
            >
              Verificar y continuar
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setShowCode(false)}
              className="w-full"
            >
              Usar otro correo
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}