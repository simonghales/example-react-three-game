const MATERIALS: {
    [key: string]: any
} = {}

interface Mesh {
    material: {
        name: string
    }
}

const setMaterial = (mesh: Mesh, materials: any) => {
    const { name } = mesh.material
    const matchedMaterial: any = materials[name.toString()]
    if (matchedMaterial) {
        // eslint-disable-next-line no-param-reassign
        mesh.material = matchedMaterial
    } else {
        console.warn(`no material matched for: ${name.toString()}`)
    }
}

const recursiveMeshes = (child: any): any[] => {
    let meshes: any[] = []

    if (child.type === 'SkinnedMesh' || child.type === 'Mesh') {
        meshes.push(child)
    } else {
        if (child.children) {
            child.children.forEach((subChild: any) => {
                meshes = meshes.concat(recursiveMeshes(subChild))
            })
        }
    }

    return meshes
}

const getSkinnedMeshes = (scene: any): any[] => {

    let meshes: any[] = []

    scene.children.forEach((child: any) => {
        meshes = meshes.concat(recursiveMeshes(child))
    })

    return meshes
}

export const setMaterials = (scene: any, materials: any = MATERIALS) => {
    const skinnedMeshes = getSkinnedMeshes(scene)
    skinnedMeshes.forEach((mesh: any) => {
        setMaterial(mesh, materials)
    })
}

export const setShadows = (scene: any) => {
    const skinnedMeshes = getSkinnedMeshes(scene)
    skinnedMeshes.forEach((mesh: any) => {
        // eslint-disable-next-line no-param-reassign
        mesh.castShadow = true
        // eslint-disable-next-line no-param-reassign
        mesh.receiveShadow = true
    })
}