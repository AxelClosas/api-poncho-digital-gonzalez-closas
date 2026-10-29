import { z } from "zod"

const uuidSchema = z.coerce.string().uuid("Formato UUID inválido")

export default uuidSchema