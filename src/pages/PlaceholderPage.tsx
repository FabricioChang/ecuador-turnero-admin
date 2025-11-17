import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text-primary">{title}</h1>
        <p className="text-admin-text-secondary">{description}</p>
      </div>

      <Card className="bg-admin-surface border-admin-border-light">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span className="text-admin-text-primary">Próximamente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-admin-text-secondary">
            Esta sección está en desarrollo. Aquí podrás gestionar {title.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;