CREATE POLICY "Personals can notify their students" ON public.notifications
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.personal_students ps
    WHERE ps.personal_id = auth.uid()
      AND ps.student_id = notifications.user_id
  )
  OR public.has_role(auth.uid(), 'admin')
);