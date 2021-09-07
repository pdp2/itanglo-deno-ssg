<!--
< postedOn: 2021-09-01
< postedBy: Paolo
-->

## HTML includes with Deno

Seen as I have decided to build this blog from the ground up, one of the first challenges to solve is how to include common blocks of HTML which are used in multiple places across the website. This is a good idea because it avoids duplication, which in turn means that it's easier to maintain because we only need to change these common blocks in one place.

If I was using a content management system like WordPress this would all be handled for me, but I didn't really want to have to pay for hosting and besides it will be fun to have a go at doing it another way. I had a read of [Chris Coyier's post](https://css-tricks.com/the-simplest-ways-to-handle-html-includes/) on the topic, which covered a lot of different ways we can achieve this, however there wasn't an option that used [Deno](https://deno.land/) so I thought I would use it as an excercise to learn more about it.

Deno is a secure runtime for JavaScript and TypeScript developed by Ryan Dahl who created the ubiquitous [Node.js](https://nodejs.org/en/) runtime. One of the differences when using Deno is that by default scripts don't automatically have file or network access. If a script needs access to the network or the file system this has to be specificed when running the program using runtime flags. Another difference that I'm quite keen on is that Deno gets rid of the concept of the `node_modules` folder. I have always seen this as a black hole of dependencies that I dare not peek inside. With Node.js we needed the `package.json` file to manage all the various dependencies, however in Deno you can import modules using a URL.

### Getting started with Deno

To begin with head over to the Deno docs to find out how to [install Deno](https://deno.land/#installation). Once you have done that, open a terminal of your choice (I use [iterm2](https://iterm2.com/) for MacOS along with the [fish shell](https://fishshell.com)) and then navigate to a suitable location on your computer, for example `/projects/deno-html-includes`. For the purpose of this example we are going to use Deno to read a text file and log the content in the terminal. To create a file called `deno.txt` containing the text "Hello Deno!", run the following command:

```
echo "Hello Deno!" >deno.txt
```

Next, we are going to create our Deno script. Start by creating a file called `hello-deno.js` and open it in a code editor like [VS Code](https://code.visualstudio.com/). If you have VS Code installed you can do this running:

```
touch hello-deno.js && code hello-deno.js
```

As an initial test, type the following JavaScript code in the `hello-deno.js` file:

```
console.log('You should see this!');
```

Then run this command in your terminal:

```
deno run hello-deno.js
```

If all goes to plan, the text "You should see this!" should be logged in the terminal. Now we have two files in our project, `deno.txt` and `hello-deno.js`. In the next step we are going to use a method from the Deno runtime API to read the contents of the text file. The method is called [Deno.readFile()](https://doc.deno.land/builtin/stable#Deno.readFile) and we can call it with a path string to instruct Deno to read a particular file. The method returns an array of bytes, so before we can print it on the screen we will need to decode it using [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder). Here is the code:

```
const decoder = new TextDecoder();
const fileData = await Deno.readFile('./deno.txt');
const fileString = decoder.decode(fileData);

console.log(fileString);</code></pre>
```

Also worth mentioning is that Deno supports the [top level await syntax](https://v8.dev/features/top-level-await) as you can see on the second line in the example above. Run the script again with `deno run hello-deno.js` and you should find it does not work! You should be seeing the following error:

```
error: Uncaught PermissionDenied: read access to "./deno.txt", run again with the --allow-read flag
```

The error tells us that permission to read the file was denied. This is due to the security feature I referred to earlier. By default, Deno doesn't allow us to read from the file system. In order to do that we have to explicitly give the script permission by using the runtime flag `--allow-read`. Runtime flags go after the `Deno run` command, but before the file name of the script:

```
deno run <strong>--allow-read</strong> hello-deno.js
```

Running the command above, should result in the text "Hello Deno!" being displayed in your terminal.

### Creating template files

I like the idea of using a custom HTML element rather than template specific syntax. If the syntax does ever take off then the template would be ready, but in the short term (and more realistically), syntax highlighting is already supported for HTML elements. With this in mind, below is an example of the template we are aspiring to:

```
&lt;include src="./header.tmpl.html"&gt;

&lt;main&gt;
    &lt;h2&gt;Our page title&lt;/h2&gt;
    &lt;p&gt;Some interesting content.&lt;/p&gt;
&lt;/main&gt;

&lt;include src="./footer.tmpl.html"&gt;
```

For this example we are working with a common use case; most websites have a common header and footer which is repeated on every page. The `include` tag, has a `src` attribute that specifies the path of the file to include. In between the include tags for the header and the footer files, we have the main content of the page. Using the code example above, create a new file called `index.tmpl.html`. Then create a further two new files called `header.tmpl.html` and `footer.tmpl.html` and add the following code:

```
&lt;!DOCTYPE html&gt;
    &lt;html lang="en"&gt;
        &lt;head&gt;
            &lt;meta charset="UTF-8"&gt;
            &lt;meta http-equiv="X-UA-Compatible" content="IE=edge"&gt;
            &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
            &lt;title&gt;Our generated index file&lt;/title&gt;
        &lt;/head&gt;
        &lt;body&gt;
        &lt;header&gt;
            &lt;h1&gt;The main heading of the page&lt;/h1&gt;
        &lt;/header&gt;
```

```
&lt;/body&gt;
&lt;/html&gt;
```

Notice that the header file doesn't have closing `body` and `html` tags, but these are included in the footer file. Now we have the template files ready, we are ready to use them to build the main index file which will be served to the browser.

### The Deno build script

At the same level in the project directory as the template files create a file called `build.js`. This file will contain the code that will instruct Deno to do the following:

<ul>
    <li>Read the index template</li>
    <li>Parse the index template and identify any include tags</li>
    <li>Get the values of the <code>src</code> attribute for each include tag to determine the paths of the files we need to read</li>
    <li>Use the paths to read the corresponding files</li>
    <li>Create the index file that will be served to the browser and include the content from the files we have read</li>
</ul>

Feel free to have a go at this yourself before reading on. A tip that might come in handy is that for my solution I am using regular expressions 😀

Let's make a start on the first part; reading the index template:

```
const decoder = new TextDecoder();
const indexTmplData = await Deno.readFile('./index.tmpl.html');
const indexTmplStr = decoder.decode(indexTmplData);
```

That should all be quite familiar as we are not covering any new ground here. The next part may get a little tricky if you are not familiar with regular expressions. Firstly, let's have a look at what our challenge is. We have the content of the index template in the form of a string and from that we want to match instances of the include tag that looks like this:

```
&lt;include src="<strong>./path-to-file</strong>.tmpl.html"&gt;
```

The part in bold is the variable part, the rest of it stays the same for each instance of the include tag. This is where regular expressions come in handy because they allow us to match a given pattern using a special syntax.

I have come across people that are absolute wizards with regular expressions and they can come up with them pretty much on the spot. Sadly, although I have some redeeming qualities, I am not one of them. For the most part I rely on trial and error and [regexr.com](https://regexr.com/).

<img src="./images/regexr-screenshot.jpg" alt="a screenshot of the regexr.com website">

In the screenshot above, hopefully you can just about make out the regexr.com website. In the middle section I have pasted the contents of the `index.tmpl.html` file. If you look closely at the screenshot you will see that just under the heading "Expression" with the light blue background, there is a regular expression that was there by default and it looks like this:

```
/([A-Z])\w+/g
```

Between the forward slashes you have the pattern that will be matched and the `g` after the second slash is a flag that indicates this should be a global match and return every instance that is matched. The round brackets at the beginning represent a capturing group, which is useful if you want to use that part of the match when doing a replacement. Inside the round brackets there is a set of square brackets, which mean that any character within them should be matched. In this example we have the range from uppercase A to uppercase Z. So the first part of the expression will match one uppercase character between A and Z. Following that the special character `\w` matches any word character and the plus symbol that follows means that it should be matched 1 or more times. So with this particular regular expression we would expect to match anything that begins with an uppercase letter and is followed by one or more word characters and as we can see in the screenshot the words "Our" and "Some" are being highlighted to show what parts of the content are being matched.

After that quick (and incomplete) whistle-stop top tour of regular expressions, we're going to have a go at writing our own to match the pattern we are interested in. To begin with, in the regexr website, clear the existing regular expression and paste the following:

```
/&lt;include src="./path-to-file.tmpl.html"&gt;/g
```

Currently it doesn't match anything because the includes we have in our content have different paths set in the `src` attribute. We know that the path can contain alphanumeric word characters, periods and hyphens so we can amend our regular expression accordingly:

```
&lt;include src="<strong>[./\w-]+</strong>.tmpl.html"&gt;/g
```

The part in bold shows the part that has changed. We have added a character set using the square brackets and inside we have specified that the allowed characters should be a period, forward slash, an alphanumeric word character and a hyphen. Outside the brackets there is a plus symbol to stipulate there should be one or more of the characters matched in the set. That seems to have done the trick, both of the includes should now be highlighted to indicate that they are matches as shown in the screenshot below: 

<img src="./images/regexr-screenshot-2.jpg" alt="a screenshot of the regexr.com website">

We now have the index template string and the regex which will match instances of the include tag. We can use the [matchAll()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll) method which we can pass a regex to and will return an iterator of matches that we can loop through with the [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) syntax as shown below.

```
...

const includeMatches = indexTmplStr.matchAll(/&lt;include src="([./\w-]+.tmpl.html)"&gt;/g);

for (const match of includeMatches) {
    console.log(match);
}

// Logs:
// [ '&lt;include src="./header.tmpl.html"&gt;', "./header" ]
// [ '&lt;include src="./footer.tmpl.html"&gt;', "./footer" ]
```

There is a small tweak to the regex in the code above and that is the inclusion of a capturing group which is specified using the parenthesis. Each match is an array which contains the string matched as the first item and the capturing group as the second item. The next step is to use the value from the capturing group to read the relevant files and then replace the match with the content of these files. Finally we will write a new text file using the [Deno.writeTextFile()](https://doc.deno.land/builtin/stable#Deno.writeTextFile) method. Here's the rest of the code that accomplishes this:

```
...

let output = indexTmplStr;

for (const matchArray of includeMatches) {
    const [match, path] = matchArray;
    const includeTmplData = await Deno.readFile(path);
    const includeTmplStr = decoder.decode(includeTmplData);
    output = output.replace(match, includeTmplStr);
}

await Deno.writeTextFile('index.html', output);
```

You should notice that if you try running the build script again you will get an error regarding write access permission. To give your script write access you need to add the `--allow-write` runtime flag. Run the command below and if all goes well the script will have created a file called `index.html` with the contents of all the compiled templates.

```
deno run --allow-read --allow-write build.js
```

You can find all the code referenced in this post in [this repo](https://github.com/pdp2/deno-html-includes). Thanks for reading.
