import { parse } from 'node-html-parser';

const BASE_URL = "https://www.marmiton.org";

type MarmitonRecipeResult = {
	title: string,
	url: string,
	image: {
		pictureUrls: {
			origin: string
		}
	},
	ingredients: string[],
}

export async function searchRecipes(ingredients: string[]): Promise<Recipe[]> {
	const url = `${BASE_URL}/recettes/recherche.aspx?aqt=${encodeURIComponent(ingredients.join(","))}`;

	const data = await fetch(url).then(response => {
		return response.text();
  	})

	const regex = /cardResults:\s*\[([\s\S]*?)\]\s*\}\s*\);/gm;

	const match = data.match(regex)?.[0];
	if (!match) {
		throw new Error("No recipes found in the response.");
	}
	const recipes = JSON.parse(match.replaceAll('cardResults: ', '').slice(0, -3));

	const promises: Promise<Recipe>[] = recipes.map((recipe: MarmitonRecipeResult) => {
		return new Promise( (res) => {
			fetch(recipe.url).then(response => {
				return response.text();
			}).then( data => {
				const html = parse(data);

				const steps = html.querySelectorAll('.recipe-step-list__container').map( (step) => {
					return step.querySelector('p')?.text;
				}).filter( (step) => step !== undefined);

				res({
					title: recipe.title,
					pictureUrl: recipe.image.pictureUrls.origin,
					steps: steps,
					ingredients: recipe.ingredients
				})
			})
		})
	})

	return Promise.all(promises);
}
