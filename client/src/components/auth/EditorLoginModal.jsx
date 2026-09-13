import { useState } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { DialogRoot, DialogTrigger, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useEditorAuth } from '../../context/EditorAuthContext';

export function EditorLoginModal() {
  const { isEditor, login, logout } = useEditorAuth();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
      setOpen(false);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Connexion impossible');
    } finally {
      setBusy(false);
    }
  }

  if (isEditor) {
    return (
      <Button variant="ghost" className="text-xs opacity-70" onClick={() => logout()}>
        <Lock size={16} /> Mode éditeur actif — Déconnexion
      </Button>
    );
  }

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted opacity-60 transition hover:bg-white/5 hover:text-neon hover:opacity-100">
        <Lock size={16} /> Mode éditeur / Connexion
      </DialogTrigger>
      <DialogContent title="Déverrouillage éditeur">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="user">Identifiant</Label>
            <Input id="user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="pass">Mot de passe</Label>
            <Input
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Connexion…' : 'Autoriser les modifications'}
          </Button>
        </motion.form>
      </DialogContent>
    </DialogRoot>
  );
}
