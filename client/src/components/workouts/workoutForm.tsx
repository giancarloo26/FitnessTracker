import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertWorkoutSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = insertWorkoutSchema.extend({
  imageUrl: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof formSchema>;

interface WorkoutFormProps {
  initialData?: Partial<WorkoutFormValues>;
  onSubmit: (data: WorkoutFormValues) => void;
  isSubmitting?: boolean;
}

export function WorkoutForm({ initialData, onSubmit, isSubmitting = false }: WorkoutFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      level: initialData?.level || "iniciante",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation we would upload to a storage service
    // For this demo, we'll use a placeholder URL and just show the image name
    const fakeImageUrl = `https://images.unsplash.com/photo-1574680096145-d05b474e2155?filename=${file.name}`;
    setImagePreview(fakeImageUrl);
    form.setValue("imageUrl", fakeImageUrl);
    
    toast({
      title: "Imagem selecionada",
      description: `${file.name} está pronta para upload.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Nome do Treino</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Treino de Pernas" 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os detalhes do seu treino..." 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Duração (minutos)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 60" 
                    min={5}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Nível de Dificuldade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Imagem de Capa</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Imagem de capa" 
                  className="mx-auto h-48 object-cover rounded-lg mb-2"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white"
                  onClick={() => {
                    setImagePreview(null);
                    form.setValue("imageUrl", "");
                  }}
                >
                  Alterar
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Arraste uma imagem ou clique para selecionar</p>
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="text-primary font-medium hover:text-primary-light transition-colors cursor-pointer"
                  >
                    Escolher imagem
                  </label>
                </div>
              </>
            )}
          </div>
        </FormItem>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-light transition-all duration-300 text-white font-medium py-2 px-6 rounded-lg"
          >
            {isSubmitting ? "Salvando..." : "Salvar Treino"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
