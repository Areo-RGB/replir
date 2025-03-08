import { Link } from "wouter";

export default function WorkInProgress() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl w-full text-center">
        <img
          src="/463392119_8861688970516690_3807812380076537012_n_attr1_subject.png"
          alt="Max Maulwurf working"
          className="mx-auto mb-6 max-w-md w-full h-auto"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Leistungsvergleich wird entwickelt
        </h1>
        <p className="text-gray-600 mb-6">
          Wir arbeiten daran, Ihnen bald eine umfassende Leistungsanalyse zur Verfügung zu stellen.
        </p>
        <Link href="/">
          <a className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Zurück zur Übersicht
          </a>
        </Link>
      </div>
    </div>
  );
}
