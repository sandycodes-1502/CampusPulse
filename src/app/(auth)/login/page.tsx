'use client';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChromeIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRedirectResult, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/use-user-role';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password to continue' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, role, isLoading } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('student');

  useEffect(() => {
    if (!auth || !firestore) return;

    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This is the signed-in user
          const firebaseUser = result.user;
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // New user via Google, create their profile documents
            const role = sessionStorage.getItem('signupRole') || 'student';
            const name = firebaseUser.displayName || 'New User';

            await setDoc(userDocRef, {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              role: role,
            });

            if (role === 'student') {
              const studentDocRef = doc(
                firestore,
                'users',
                firebaseUser.uid,
                'students',
                firebaseUser.uid
              );
              await setDoc(studentDocRef, {
                id: firebaseUser.uid,
                userId: firebaseUser.uid,
                name: name,
                email: firebaseUser.email,
              });
            } else if (role === 'security') {
              const securityDocRef = doc(
                firestore,
                'roles_security',
                firebaseUser.uid
              );
              await setDoc(securityDocRef, {
                id: firebaseUser.uid,
                userId: firebaseUser.uid,
                name: name,
                email: firebaseUser.email,
                employeeId: `EMP-${Math.random()
                  .toString(36)
                  .substring(2, 8)
                  .toUpperCase()}`,
              });
            } else if (role === 'admin') {
              const adminDocRef = doc(
                firestore,
                'roles_admin',
                firebaseUser.uid
              );
              await setDoc(adminDocRef, {
                id: firebaseUser.uid,
                userId: firebaseUser.uid,
                name: name,
                email: firebaseUser.email,
                employeeId: `ADM-${Math.random()
                  .toString(36)
                  .substring(2, 8)
                  .toUpperCase()}`,
              });
            }
            sessionStorage.removeItem('signupRole');
            sessionStorage.removeItem('signupName');
          }
          // After profile creation, the useUserRole hook will get the role,
          // and the redirect logic below will trigger.
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Google Sign-In Failed',
          description: error.message,
        });
      }
    };

    handleRedirect();
  }, [auth, firestore, toast]);

  useEffect(() => {
    if (!isLoading && user && role) {
      router.replace(`/${role}-dashboard`);
    }
  }, [user, role, isLoading, router]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: FormSchema) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // On successful login, the useEffect will handle redirection.
    } catch (error: any) {
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: error.message,
        });
      }
    }
  };

  const handleGoogleSignIn = () => {
    if (!auth) return;
    sessionStorage.setItem('signupRole', selectedRole);
    initiateGoogleSignIn(auth);
  };

  // Show loading skeleton while checking auth state or creating profile
  if (isLoading || (user && !role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in with a role, they will be redirected by the useEffect.
  // Return null to prevent the login form from flashing.
  if (user && role) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="absolute top-6 left-6">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Label htmlFor="role">I am a</Label>
            <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isValid}
              >
                Sign in
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <ChromeIcon className="mr-2" />
            Sign in with Google
          </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
